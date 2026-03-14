from fastapi import APIRouter
from pydantic import BaseModel
from backend.financial_calculations import (
    calculate_sip, 
    calculate_lump_sum, 
    calculate_goal, 
    calculate_inflation, 
    calculate_expense_ratio
)

router = APIRouter()

class SIPRequest(BaseModel):
    monthly_investment: float
    annual_return_rate: float
    years: int

class LumpSumRequest(BaseModel):
    principal: float
    annual_return_rate: float
    years: int

class GoalRequest(BaseModel):
    target_amount: float
    annual_return_rate: float
    years: int

class InflationRequest(BaseModel):
    current_amount: float
    inflation_rate: float
    years: int

class ExpenseRatioRequest(BaseModel):
    principal: float
    monthly_investment: float
    annual_return_rate: float
    years: int
    expense_ratio_a: float
    expense_ratio_b: float


@router.post("/sip")
def sip_endpoint(req: SIPRequest):
    return calculate_sip(req.monthly_investment, req.annual_return_rate, req.years)

@router.post("/lumpsum")
def lumpsum_endpoint(req: LumpSumRequest):
    return calculate_lump_sum(req.principal, req.annual_return_rate, req.years)

@router.post("/goal")
def goal_endpoint(req: GoalRequest):
    return calculate_goal(req.target_amount, req.annual_return_rate, req.years)

@router.post("/inflation")
def inflation_endpoint(req: InflationRequest):
    return calculate_inflation(req.current_amount, req.inflation_rate, req.years)

@router.post("/expense-ratio")
def expense_ratio_endpoint(req: ExpenseRatioRequest):
    return calculate_expense_ratio(
        req.principal, req.monthly_investment, req.annual_return_rate, 
        req.years, req.expense_ratio_a, req.expense_ratio_b
    )
