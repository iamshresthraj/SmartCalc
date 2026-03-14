def calculate_sip(monthly_investment: float, annual_return_rate: float, years: int):
    """
    SIP (Systematic Investment Plan) Calculation
    Future Value = P × ({[1 + i]^n - 1} / i) × (1 + i)
    P = Monthly Investment
    i = Monthly return rate (Annual Rate / 12 / 100)
    n = Total number of months
    """
    total_months = years * 12
    monthly_rate = annual_return_rate / 12 / 100
    total_invested = monthly_investment * total_months
    
    # Calculate yearly data for charts
    yearly_data = []
    current_invested = 0
    current_value = 0
    
    for year in range(1, years + 1):
        months = year * 12
        # Future value at this year
        fv = monthly_investment * (((1 + monthly_rate)**months - 1) / monthly_rate) * (1 + monthly_rate)
        invested = monthly_investment * months
        yearly_data.append({
            "year": year,
            "invested": round(invested, 2),
            "value": round(fv, 2)
        })
    
    future_value = yearly_data[-1]["value"] if yearly_data else 0
    wealth_gained = future_value - total_invested
    
    return {
        "total_invested": round(total_invested, 2),
        "future_value": round(future_value, 2),
        "wealth_gained": round(wealth_gained, 2),
        "yearly_data": yearly_data
    }


def calculate_lump_sum(principal: float, annual_return_rate: float, years: int):
    """
    Lump Sum Investment Calculation (Compound Interest)
    A = P(1 + r/n)^(nt)
    """
    r = annual_return_rate / 100
    
    yearly_data = []
    for year in range(1, years + 1):
        amount = principal * (1 + r)**year
        yearly_data.append({
            "year": year,
            "invested": round(principal, 2),
            "value": round(amount, 2)
        })
        
    future_value = yearly_data[-1]["value"] if yearly_data else principal
    wealth_gained = future_value - principal
    
    return {
        "total_invested": round(principal, 2),
        "future_value": round(future_value, 2),
        "wealth_gained": round(wealth_gained, 2),
        "yearly_data": yearly_data
    }


def calculate_goal(target_amount: float, annual_return_rate: float, years: int):
    """
    Reverse SIP calculation: Find required monthly investment to reach a goal.
    """
    total_months = years * 12
    monthly_rate = annual_return_rate / 12 / 100
    
    # P = FV / [({[1 + i]^n - 1} / i) × (1 + i)]
    numerator = target_amount
    denominator = (((1 + monthly_rate)**total_months - 1) / monthly_rate) * (1 + monthly_rate)
    
    required_monthly = numerator / denominator if denominator > 0 else 0
    
    return {
        "required_monthly_sip": round(required_monthly, 2),
        "target_amount": target_amount,
        "total_investment": round(required_monthly * total_months, 2)
    }


def calculate_inflation(current_amount: float, inflation_rate: float, years: int):
    """
    Calculate the future purchasing power of current money.
    Future Value = Present Value / (1 + r)^n
    """
    r = inflation_rate / 100
    
    yearly_data = []
    current_value = current_amount
    
    for year in range(1, years + 1):
        # Calculate how much current_amount will be WORTH in the future due to inflation
        future_purchasing_power = current_amount / ((1 + r)**year)
        
        # Calculate how much you will NEED to buy the same thing in the future
        future_cost_equivalent = current_amount * ((1 + r)**year)
        
        yearly_data.append({
            "year": year,
            "purchasing_power": round(future_purchasing_power, 2),
            "future_cost": round(future_cost_equivalent, 2)
        })
        
    return {
        "original_amount": current_amount,
        "future_purchasing_power": yearly_data[-1]["purchasing_power"] if yearly_data else current_amount,
        "future_cost": yearly_data[-1]["future_cost"] if yearly_data else current_amount,
        "yearly_data": yearly_data
    }


def calculate_expense_ratio(principal: float, monthly_investment: float, annual_return_rate: float, years: int, er_a: float, er_b: float):
    """
    Compare two investment scenarios built on identical continuous investments
    but different expense ratios.
    Effective rate = Annual Rate - Expense Ratio
    """
    eff_rate_a = max(0, annual_return_rate - er_a)
    eff_rate_b = max(0, annual_return_rate - er_b)
    
    data_a = calculate_lump_sum(principal, eff_rate_a, years) if monthly_investment == 0 else calculate_sip(monthly_investment, eff_rate_a, years)
    data_b = calculate_lump_sum(principal, eff_rate_b, years) if monthly_investment == 0 else calculate_sip(monthly_investment, eff_rate_b, years)
    
    # We will assume if principal > 0 and monthly > 0, we can just do calculating them separately and add.
    # To keep it simple, we either use SIP OR Lumpsum logic above, but let's do a combined for completeness
    
    yearly_data = []
    
    for year in range(1, years + 1):
        # Base math for compound + SIP
        months = year * 12
        r_a_m = eff_rate_a / 12 / 100
        r_b_m = eff_rate_b / 12 / 100
        
        # Scenario A
        val_a = principal * (1 + eff_rate_a/100)**year
        if monthly_investment > 0 and r_a_m > 0:
            val_a += monthly_investment * (((1 + r_a_m)**months - 1) / r_a_m) * (1 + r_a_m)
            
        # Scenario B
        val_b = principal * (1 + eff_rate_b/100)**year
        if monthly_investment > 0 and r_b_m > 0:
            val_b += monthly_investment * (((1 + r_b_m)**months - 1) / r_b_m) * (1 + r_b_m)
            
        yearly_data.append({
            "year": year,
            "val_a": round(val_a, 2),
            "val_b": round(val_b, 2),
            "difference": round(abs(val_a - val_b), 2)
        })
        
    final_val_a = yearly_data[-1]["val_a"] if yearly_data else principal
    final_val_b = yearly_data[-1]["val_b"] if yearly_data else principal
    
    return {
        "final_value_a": final_val_a,
        "final_value_b": final_val_b,
        "wealth_difference": round(abs(final_val_a - final_val_b), 2),
        "total_invested": principal + (monthly_investment * years * 12),
        "yearly_data": yearly_data
    }
