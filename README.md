# Introduction
Journalism is a profession which requires to be able to communicate effectively using data from various sources. Web visualizations can become extremely helpful tools for journalists to make sure they can tell a story using official data sources. This project uses the D3 Javascript library to generate interactive correlation plots using demoghraphic data from the US Census Bureau data set. The objective is to correlate health and income variables in interactive plots which can be modified using the user's selection. You can check the final deployed application [here](https://javisandoval94.github.io/D3-Challenge/D3_data_journalism/index.html).

# Data set
The complete data set can be located in the `data.csv` file in the `assets > data` folder within this repository. This data source comes from the [US Census Bureau data sets](https://data.census.gov/cedsci/) and was provided by the Tecnológico de Monterrey Data Analytics and Visualizatioin Bootcamp for the February - August 2020 term.

# Code explanation
The results are rendered in the `index.html` file. Make sure to have the `assets` folder available in your working directory, since it contains the corresponding `.css`, `.js`, and `.csv` files necessary to render the plots, as well as the necessary dependencies installed. This script uses the `d3-tip.js` plugin, developed by [Justin Palmer](https://github.com/Caged).
