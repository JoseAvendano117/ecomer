from fastapi import FastAPI
from pydantic import BaseModel
from typing import List 
from supabase import create_client, client 
import os 
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials = True,
    allow_headers =["*"]
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

#creacion de modelos producto
class products (BaseModel): 
    id: int
    name : str 
    price : float
    stock : int 
    
    
#creacion de modelo usuario
class  seller_user (BaseModel): 
    name : str 
    email : str 
    password : str
    nit : int
    cell : int

class  registration_user (BaseModel): 
    id: int
    name : str 
    email : str 
    password : str
    cell : int
    
class loginData (BaseModel):
    email: str
    password : str

@app.post("/products") # Ruta
def create_products(prod:products): # Endpoint
    try:
        supabase.table("products").insert(prod.model_dump()).execute()
        return{"status": "ok", "msg": "Guardado con exito"}
    except Exception as e:
        print("Error:", e)
        return {"status": "error", "msg": str(e)}

    
@app.get("/products", response_model= List[products])#ruta
def List_products():
    pass

@app.post("/seller_user") # Ruta
def create_seller_user(prod:seller_user): # Endpoint
    try:
        supabase.table("seller_user").insert(prod.model_dump()).execute()
        return{"status": "ok", "msg": "Guardado con exito"}
    except Exception as e:
        print("Error:", e)
        return {"status": "error", "msg": str(e)}

    
@app.get("/seller_user", response_model= List[seller_user])#ruta
def List_seller_user():
    pass


@app.post("/registration_user") # Ruta
def create_registration_user(prod:registration_user): # Endpoint
    try:
        supabase.table("registration_user").insert(prod.model_dump()).execute()
        return{"status": "ok", "msg": "Guardado con exito"}
    except Exception as e:
        print("Error:", e)
        return {"status": "error", "msg": str(e)}

    
@app.get("/registration_user", response_model= List[registration_user])#ruta
def List_registration_user():
    pass

# configuracion de la url de login
@app.post("/loginData")
def login(data: loginData):
    try:
        # Normalizar el email
        email_normalizado = data.email.strip().lower()

        # Buscar en usuarios normales
        response = supabase.table("registration_user").select("*").eq("email", email_normalizado).execute()
        users = response.data

        if users and len(users) > 0:
            user = users[0]
            if user["password"] == data.password:
                return {"status": "ok", "msg": "Inicio de sesión correctamente", "tipo": "usuario"}

        # Buscar en vendedores
        response = supabase.table("seller_user").select("*").eq("email", email_normalizado).execute()
        sellers = response.data

        if sellers and len(sellers) > 0:
            seller = sellers[0]
            if seller["password"] == data.password:
                return {
                    "status": "ok",
                    "msg": "Inicio de sesión correctamente vendedor",
                    "tipo": "vendedor",
                    "redirect": "/static/productos.html"
                }

        return {"status": "error", "msg": "No estás registrado, te invitamos a hacerlo"}

    except Exception as e:
        print("Error en login:", e)
        return {"status": "error", "msg": str(e)}



    
@app.get("/loginData", response_model= List[loginData])#ruta
def List_loginData():
    pass
