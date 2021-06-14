import api from "./api";


export async function handleGoogleLogUp(email, password) {
    try {
        const result = await api.post("/api/user/logup", { email, password });
        // await localStorage.setItem("user", email);
        // await localStorage.setItem("password", password);
        localStorage.removeItem("user");
        localStorage.removeItem("password");
    } catch (err) {
        window.alert(err);
    }


}

export async function handleGoogleLogIn(email, password) {
    try {
        const {
            data: { token },
        } = await api.post("/api/user/login", { email, password });

        localStorage.setItem("token", JSON.stringify(token));
        localStorage.removeItem("user");
        localStorage.removeItem("password");
        api.defaults.headers.Authorization = `Bearer ${token}`;
        //history.push("/repositories");
    } catch (err) {
        window.alert(err);
    }
};

export async function handleGoogleUpdateAccount( email, password,googleEmail, googlePassword) {
    try {

        const result = await api.patch("/api/user/update", { email, password, newEmail: googleEmail, newPassword: googlePassword });


        localStorage.removeItem("user");
        localStorage.removeItem("password");
    } catch (err) {
        window.alert(err);
    }
};