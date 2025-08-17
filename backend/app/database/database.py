import os
import time
import schedule
import dropbox
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


DROPBOX_TOKEN = "sl.u.AF7ib6cU0s09GIf9Ok75Fa1c_K8CYzcxF01AfLpJ1vteFEtrVfcRjWfGDW4G-rwBm1EhCWSXE-sOdreJYove5sWjKt-zAWoes1HUXRKKapZ4PNLBmzhEj9hY0_FfJpmP5nw5sTWM8zG3vIjMdKf0DTdjOPqFlZNqvZXa4zPXMb6OZEJa2vIENAbOE_zze9vwK3Ua7q_bsQK5AXfHtvD6faUI5bD3jqHOiX77HXF4E0FOfv_DapisOXnaP6m7reWoVTMJ68K6zI_0nkS2VnS9fOHMPPiEJ1SF1dRcQjM8lLpe4H7gh60tfsAuvR-15oK2QcLP452d_gMpZ6QdxTFTUEtKv12x3y_E54CXqGdI-R_7hWPyzFvkxotVZR1yVUsvCQkYidzLNYFwcukn3N4KYVuF-4vSSTdbIL7MQKVRpa07xA8FmDGTveuR9QJo-EQH7MZE_yf4aWHI6KlPrCcXraJyvVG-eBZb74-wRZAEWY6asL6SYRH4DtBEm5LVZXKqmUBvDg6XTKbr_qsIb7Dnd-HsNtG0SDvES-TpA7ynJmZ4AS1UuYajH-NO1PNJcCytGsLF2O8eTgKx-zj9rnh1yHuXS3nrAatMph6SaZY6FrN5rArwOQbKiKLPVQW2w7daocpgOreeorBBcsF3aVNq34PWk3Ihqm_cGpPIyxSFKOfZi2COx607zPq1VfK9cz9xD1UbgGtPzub_B-PeaLiPgEluEbpNnC8tfg_vastDUiic5U77RU7290q5idfjRrI3uiiBxle2XoxpXl5AYxP_fJvSSPtjkAccXt-tJ9lUTS4Uhko3IETS59Xq9j3jbcEv2xQ2RVKq4NAk3MbQVdzSe6o7pbGlcaLTEsD6mfYwEJdTlUK64J36Dn8AviKj8I7aV1jlLjSRpa6BVkBCksc1ADJeJ-LuYuPYrtexnVbBIKQZ1Wg2PjmfR_fBETG-flIXeizh4e1VNttJRtAp4L5GK1whjhB5yiNJVJvpKwVSy3HIP5r_ZlSb0zdNT9p4SLwHv1MOx4v6FNEf_lv2q9HpN9RAlrzCLv782hVjiJ-BXylywfbZJFCwdUDbQZjSDpcDggnUMQDTVnYLyXrjB4xwZ21TmA38qAk8AhWz9aFGpy_s9kTAB3BIxSQz-iHYp2TGMP_FNr6suhZgdHK8XytRBdEUL8qbyV7mVyuBFpRcx165zKYGI-CT7zScA2ykJUSBnqahxnHGzd1-eT7ZOptdB5DZ_yIgKEGJbt590_qoySeAKKa5MzmQ3qNOosLHG34l16SIOpPvojxaGUMx4LUQUtOW-wqAZu6mfHMKDXWbQVRfSwwTbyO818H9st6Q6HWVJcJT1rdaS3AyVrT-ivNd0BHSXB345P1RZM0bBx3OUIMYwqbL759jGf9h930xnliZ4pGYbcGOTZdd3MoDG-oAgtCN4WYtPjysZOy5kNv4yfpjOlP1-u0GQpC7u1YOpkjMLho"  
DROPBOX_DB_PATH = "/focusdatabase.db"  
LOCAL_DB_PATH = "./focusdatabase.db"   


def baixar_banco():
    """Baixa o banco de dados do Dropbox para o local"""
    dbx = dropbox.Dropbox(DROPBOX_TOKEN)
    try:
        print("📥 Baixando banco do Dropbox...")
        metadata, res = dbx.files_download(DROPBOX_DB_PATH)
        with open(LOCAL_DB_PATH, "wb") as f:
            f.write(res.content)
        print("✅ Banco atualizado localmente.")
    except dropbox.exceptions.ApiError:
        print("⚠️ Banco não encontrado no Dropbox, será criado localmente.")

def subir_banco():
    """Envia o banco local para o Dropbox"""
    dbx = dropbox.Dropbox(DROPBOX_TOKEN)
    if os.path.exists(LOCAL_DB_PATH):
        with open(LOCAL_DB_PATH, "rb") as f:
            print("📤 Enviando banco para o Dropbox...")
            dbx.files_upload(f.read(), DROPBOX_DB_PATH, mode=dropbox.files.WriteMode("overwrite"))
            print("✅ Banco enviado com sucesso.")
    else:
        print("⚠️ Banco local não encontrado.")


DATABASE_URL = f"sqlite:///{LOCAL_DB_PATH}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

