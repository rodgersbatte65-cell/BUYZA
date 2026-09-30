const SUPABASE_URL =
    "https://xbjmdsdgisusnxdmlrxh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_FiaziwSklP22XFb1vfazZw_AudR-1-J";


async function refreshBuyzaSession() {

    const refreshToken =
        localStorage.getItem("buyza_refresh_token");

    if (!refreshToken) {
        return false;
    }

    try {

        const response = await fetch(
            SUPABASE_URL +
            "/auth/v1/token?grant_type=refresh_token",
            {
                method: "POST",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    refresh_token: refreshToken
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Session refresh failed:",
                data
            );

            return false;
        }

        if (data.access_token) {

            localStorage.setItem(
                "buyza_access_token",
                data.access_token
            );
        }

        if (data.refresh_token) {

            localStorage.setItem(
                "buyza_refresh_token",
                data.refresh_token
            );
        }

        if (data.user) {

            localStorage.setItem(
                "buyza_user",
                JSON.stringify(data.user)
            );
        }

        return true;

    } catch (error) {

        console.error(
            "Could not refresh session:",
            error
        );

        return false;
    }
}


/*
 * Check the session when a BUYZA page opens.
 */
async function checkBuyzaSession() {

    const accessToken =
        localStorage.getItem("buyza_access_token");

    const refreshToken =
        localStorage.getItem("buyza_refresh_token");


    if (!accessToken && !refreshToken) {
        return false;
    }


    /*
     * Try to refresh the session.
     * Supabase will issue a fresh access token.
     */
    if (refreshToken) {

        const refreshed =
            await refreshBuyzaSession();

        if (refreshed) {
            return true;
        }
    }


    return !!localStorage.getItem(
        "buyza_access_token"
    );
}
