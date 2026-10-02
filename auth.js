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

        const controller =
            new AbortController();

        const timeout =
            setTimeout(
                () => controller.abort(),
                10000
            );

        const response =
            await fetch(

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
                    }),

                    signal: controller.signal
                }
            );

        clearTimeout(timeout);

        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "Refresh failed:",
                data
            );

            /*
             * Remove bad session.
             */

            localStorage.removeItem(
                "buyza_access_token"
            );

            localStorage.removeItem(
                "buyza_refresh_token"
            );

            localStorage.removeItem(
                "buyza_user"
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
            "Refresh error:",
            error
        );

        localStorage.removeItem(
            "buyza_access_token"
        );

        localStorage.removeItem(
            "buyza_refresh_token"
        );

        localStorage.removeItem(
            "buyza_user"
        );

        return false;
    }
}


async function checkBuyzaSession() {

    const accessToken =
        localStorage.getItem(
            "buyza_access_token"
        );

    const refreshToken =
        localStorage.getItem(
            "buyza_refresh_token"
        );


    if (!accessToken && !refreshToken) {

        return false;
    }


    /*
     * If we have a refresh token,
     * get a fresh access token.
     */

    if (refreshToken) {

        const refreshed =
            await refreshBuyzaSession();

        if (refreshed) {

            return true;
        }

        return false;
    }


    /*
     * No refresh token.
     * Keep the existing access token.
     */

    return !!accessToken;
}


async function getBuyzaAccessToken() {

    const refreshed =
        await refreshBuyzaSession();


    if (refreshed) {

        return localStorage.getItem(
            "buyza_access_token"
        );
    }


    return localStorage.getItem(
        "buyza_access_token"
    );
}
