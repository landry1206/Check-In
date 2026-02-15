from locust import HttpUser, task, between

# ===========================
# UTILISATEUR SIMULÉ
# ===========================
class AdminUser(HttpUser):
    wait_time = between(1, 3)  # temps d'attente entre 2 tâches

    # 🔹 Identifiants de test
    email = "landry@gmail.com"
    password = "landry12"
    token = None

    # ===========================
    # TÂCHE 1 : LOGIN
    # ===========================
    @task(1)
    def login(self):
        response = self.client.post(
            "/api/auth/login/",
            json={"email": self.email, "password": self.password},
        )
        if response.status_code == 200:
            self.token = response.json().get("access")
        else:
            print("Login failed:", response.text)

    # ===========================
    # TÂCHE 2 : LISTE DES ADMINS
    # ===========================
    @task(2)
    def list_admins(self):
        if self.token:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = self.client.get("/api/auth/admins/", headers=headers)
            if response.status_code != 200:
                print("Erreur list admins:", response.status_code, response.text)
        else:
            # Si pas de token, on tente le login
            self.login()
