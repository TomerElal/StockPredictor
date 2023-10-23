import requests
import numpy as np

symbols = [
    # 'TSLA', 'AAPL', 'MSFT', 'NVDA', 'NFLX', 'GOOGL', 'META', 'PYPL', 'BABA', 'TSM',
    # 'AVGO', 'ORCL', 'ADBE', 'ASML', 'CSCO', 'NKE', 'CRM', 'ACN', 'AMD',
    # 'SAP', 'INTC', 'INTU', 'TXN', 'IBM', 'QCOM', 'NOW', 'AMAT', 'SONY',
    # 'MCD', 'ADI', 'LRCX', 'PANW', 'MU', 'SNPS', 'INFY', 'FI', 'CDNS', 'SHOP',
    # 'VMW', 'KLAC', 'ANET', 'WDAY', 'ROP', 'DELL', 'NXPI', 'APH', 'MSI',
    # 'FTNT', 'ADSK', 'MCHP', 'TEL', 'STM', 'CTSH',
    # 'FIS', 'IT', 'CDW', 'SQ', 'HPQ', 'FTV', 'SPLK', 'ANSS',
    # 'ZS', 'GLW', 'FICO', 'HUBS', 'KEYS', 'VRSN', 'HPE','MPWR', 'BR',
    # 'GRMN', 'UMC', 'TDY', 'FLT', 'JBL', 'PTC', 'ASX', 'AKAM', 'FSLR',
    # 'CHKP', 'TYL', 'NTAP', 'PAYC', 'SWKS', 'TER', 'SMCI', 'OKTA',
    # 'ENTG', 'WDC', 'STX',  'EPAM', 'LDOS', 'SSNC', 'TRMB',
    # 'MANH', 'GEN', 'CDAY', 'GDDY', 'LOGI', 'FLEX',  'PCTY', 'ZBRA', 'JKHY'
]

api_key = "NEYJGBOIAFMI8XSV"


def init_csv(csvw):
    csvw.writerow(reversed(
        ["RevenueGrowth2019", "RevenueGrowth2020", "RevenueGrowth2021",
         "NetIncomeGrowth2019", "NetIncomeGrowth2020", "NetIncomeGrowth2021",
         "ProfitMarginGrowth2019", "ProfitMarginGrowth2020", "ProfitMarginGrowth2021",
         "FCFGrowth2019", "FCFGrowth2020", "FCFGrowth2021",
         "StockSharesGrowth2019", "StockSharesGrowth2020", "StockSharesGrowth2021",
         "RevenueFourYearsGrowth", "NetIncomeFourYearsGrowth", "ProfitMarginFourYearsGrowth",
         "FCFFourYearsGrowth", "StockSharesFourYearsGrowth",
         "AssetsLiabilitiesFourYearsGrowth", "StockPriceFourYearsGrowth"]))


def extract_data1():
    global report
    for report in reversed(data1["annualReports"][1:]):
        revenue = int(report.get("totalRevenue"))
        net_income = int(report.get("netIncome"))
        profit_margin = (net_income / revenue) * 100
        revenue_data.append(revenue)
        net_income_data.append(net_income)
        profit_margin_data.append(profit_margin)


def extract_data2():
    global report
    for report in reversed(data2["annualReports"][1:]):
        common_stock_shares_outstanding_data.append(int(report["commonStockSharesOutstanding"]))
    assets_vs_liabilities_2021 = int(data2["annualReports"][1]["totalAssets"]) - int(
        data2["annualReports"][1][
            "totalLiabilities"])
    assets_vs_liabilities_2018 = int(data2["annualReports"][4]["totalAssets"]) - int(
        data2["annualReports"][4][
            "totalLiabilities"])
    assets_vs_liabilities_2018_2021_diff = assets_vs_liabilities_2021 - assets_vs_liabilities_2018
    assets_vs_liabilities_growth.append(
        round(assets_vs_liabilities_2018_2021_diff / assets_vs_liabilities_2018 * 100, 2))


def extract_data3():
    global report
    for report in reversed(data3["annualReports"][1:]):
        operatingCashflow = float(report["operatingCashflow"])
        capitalExpenditures = float(report["capitalExpenditures"])
        FCF_data.append(operatingCashflow - capitalExpenditures)


def compute_growth(data):
    return round((data[3] - data[0]) / abs(data[0]) * 100, 2)


def compute_growth_by_year(data):
    return [round((data[i] - data[i - 1]) / abs(data[i - 1]) * 100, 2) for i in
            range(1, 4)]


def extract_data_api(symbol):
    global revenue_data, net_income_data, FCF_data, profit_margin_data, common_stock_shares_outstanding_data, \
        assets_vs_liabilities_growth, stock_price_growth, data1, data2, data3
    url1 = f"https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol={symbol}&apikey={api_key}"
    url2 = f"https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol={symbol}&apikey={api_key}"
    url3 = f"https://www.alphavantage.co/query?function=CASH_FLOW&symbol={symbol}&apikey={api_key}"
    response1, response2, response3 = requests.get(url1), requests.get(url2), requests.get(
        url3)
    revenue_data, net_income_data, FCF_data, profit_margin_data, common_stock_shares_outstanding_data, \
        assets_vs_liabilities_growth = [], [], [], [], [], []
    if all(response.status_code == 200 for response in [response1, response2, response3]):
        data1, data2, data3 = response1.json(), response2.json(), response3.json()
        if "annualReports" in data1 and "annualReports" in data2 \
                and "annualReports" in data3:
            extract_data1()
            extract_data2()
            extract_data3()
        else:
            print(f"No valid data for {symbol}")
    else:
        print(f"Failed to retrieve data for {symbol}")


def preprocess_data():
    global four_years_growth, revenue_data, net_income_data, FCF_data, common_stock_shares_outstanding_data, profit_margin_data
    four_years_growth = [compute_growth(revenue_data),
                         compute_growth(net_income_data),
                         round((profit_margin_data[3] - profit_margin_data[0]), 2),
                         compute_growth(FCF_data),
                         compute_growth(common_stock_shares_outstanding_data)]
    revenue_data = compute_growth_by_year(revenue_data)
    net_income_data = compute_growth_by_year(net_income_data)
    FCF_data = compute_growth_by_year(FCF_data)
    common_stock_shares_outstanding_data = compute_growth_by_year(common_stock_shares_outstanding_data)
    profit_margin_data = [round((profit_margin_data[i] - profit_margin_data[i - 1]), 2) for i in range(1, 4)]


def extract_fundamentals(symbol):
    try:
        extract_data_api(symbol)
        preprocess_data()
        stock_data = (revenue_data + net_income_data + profit_margin_data +
                      FCF_data + common_stock_shares_outstanding_data +
                      four_years_growth + assets_vs_liabilities_growth)
        stock_data.reverse()
        return np.array(stock_data).reshape(1, -1)
    except Exception:
        return None


