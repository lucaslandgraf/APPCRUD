import sys
import json
from datetime import date
import pandas as pd
import mysql.connector 
from sklearn.linear_model import LinearRegression 
from sklearn.metrics import r2_score 
import numpy as np

def calcular_idade(data_nascimento):
    """Calcula a idade com precisão decimal."""
    hoje = date.today()
    data_nasc_simples = data_nascimento.date() 
    diferenca_dias = (hoje - data_nasc_simples).days 
    return diferenca_dias / 365.25

def main():
    """Função principal que faz a análise e imprime o JSON."""
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="", 
            database="sps-mobile"
        )

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
        
        df = pd.read_sql(sql_query, db)
        db.close()

        if len(df) < 2:
            raise Exception("Dados insuficientes para calcular a regressão (mínimo 2 pontos).")

        df['data_nascimento'] = pd.to_datetime(df['data_nascimento'])
        df['idade'] = df['data_nascimento'].apply(calcular_idade)
        
        X_df = df[['idade']]       
        Y_df = df['nivel_anticorpos'] 

        #  ANÁLISE EXPLORATÓRIA (AED) 
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

        # CALCULAR A REGRESSÃO LINEAR
        model = LinearRegression()
        model.fit(X_df, Y_df)

        # Pegar os resultados
        alpha = model.intercept_      
        beta = model.coef_[0]         
        Y_pred = model.predict(X_df)
        r2 = r2_score(Y_df, Y_pred)

        # JSON de saída
        data_points = df.rename(columns={'idade': 'x', 'nivel_anticorpos': 'y'})[['x', 'y']].to_dict('records')

        resultados = {
            "dataPoints": data_points,
            "model": {
                "alpha": alpha,
                "beta": beta,
                "R2": r2,
                "equation": f"Y = {alpha:.2f} + {beta:.2f} * X"
            },
            # --- NOVO: Adiciona o resultado da AED ao JSON ---
            "aed_stats": {
                "idade": aed_idade,
                "nivel_anticorpos": aed_anticorpos
            }
        }

        # Imprimir o JSON
        print(json.dumps(resultados))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()