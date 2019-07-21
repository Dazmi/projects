import os
import pandas as pd
import numpy as np


asxnames = os.listdir("data")

main_df = pd.DataFrame()

for name in asxnames:
    df = pd.read_csv(f'data/{name}',  header=0, index_col=0)
    main_df = [main_df, df]
    print(main_df.shape)

print(main_df)