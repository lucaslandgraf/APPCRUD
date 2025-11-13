import sys
import json
from datetime import date, datetime
import pandas as pd
import numpy as np
import statsmodels.api as sm
import mysql.connector 

def calcular_idade(data_nascimento_dt):
    """Calcula a idade com precisão decimal a partir de um objeto datetime."""
    hoje = date.today()
    data_nasc_simples = data_nascimento_dt.date() 
    diferenca_dias = (hoje - data_nasc_simples).days 
    return diferenca_dias / 365.25

def main():
    """Função principal que busca dados no SQL, faz a análise e imprime o JSON."""
    db = None 
    try:
        db_config = {
            'host': 'localhost',     
            'user': 'root',           
            'password': '',           
            'database': 'sps-mobile'  
        }

        sql_query = """
            SELECT 
                p.data_nascimento,
                e.nivel_anticorpos
            FROM exame_covid_19 e
            JOIN paciente p ON e.paciente_id = p.id
            WHERE 
                e.nivel_anticorpos IS NOT NULL 
                AND p.data_nascimento IS NOT NULL;
        """
        
        db = mysql.connector.connect(**db_config)
        
        # Executa a query e carrega diretamente no DataFrame
        df = pd.read_sql(sql_query, db)

        if len(df) < 2:
            raise Exception("Dados insuficientes para calcular a regressão (mínimo 2 pontos).")

        # Converte colunas
        df['data_nascimento'] = pd.to_datetime(df['data_nascimento'])
        df['nivel_anticorpos'] = pd.to_numeric(df['nivel_anticorpos'])
        
        df['idade'] = df['data_nascimento'].apply(calcular_idade)
        
        aed_idade = {
            "media": df['idade'].mean(),
            "mediana": df['idade'].median(),
            "moda": df['idade'].mode()[0] if not df['idade'].mode().empty else None, 
            "variancia": df['idade'].var(),
            "desvio_padrao": df['idade'].std(),
            "amplitude": df['idade'].max() - df['idade'].min(),
            "min": df['idade'].min(),
            "max": df['idade'].max()
        }
        
        Y_df = df['nivel_anticorpos']
        aed_anticorpos = {
            "media": Y_df.mean(),
            "mediana": Y_df.median(),
            "moda": Y_df.mode()[0] if not Y_df.mode().empty else None,
            "variancia": Y_df.var(),
            "desvio_padrao": Y_df.std(),
            "amplitude": Y_df.max() - Y_df.min(),
            "min": Y_df.min(),
            "max": Y_df.max()
        }

        # CALCULAR REGRESSÃO COM STATSMODELS
        Y = df['nivel_anticorpos']
        X = df['idade']
        X = sm.add_constant(X) 
        model = sm.OLS(Y, X).fit()

        alpha = model.params['const']
        beta = model.params['idade']
        r2 = model.rsquared
        p_value_beta = model.pvalues['idade']
        
        data_points = df.rename(columns={'idade': 'x', 'nivel_anticorpos': 'y'})[['x', 'y']].to_dict('records')

        resultados = {
            "dataPoints": data_points,
            "model": {
                "alpha": alpha,
                "beta": beta,
                "R2": r2,
                "p_value": p_value_beta,
                "equation": f"Y = {alpha:.2f} + {beta:.2f} * X"
            },
            "aed_stats": {
                "idade": aed_idade,
                "nivel_anticorpos": aed_anticorpos
            }
        }

        print(json.dumps(resultados)) # Envia o JSON final para o Node.js

    except Exception as e:
        # Imprime o erro no stderr para o Node.js capturar
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
        
    finally:
        # Garante que a conexão com o banco seja fechada
        if db and db.is_connected():
            db.close()

if __name__ == "__main__":
    main()