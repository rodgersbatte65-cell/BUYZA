<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>My Favorites - BUYZA</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f5f6f8;
            color: #222;
        }

        header {
            background: #111;
            color: white;
            padding: 18px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        header h1 {
            margin: 0;
        }

        header a {
            color: white;
            text-decoration: none;
            margin-left: 15px;
        }

        .container {
            max-width: 1100px;
            margin: 30px auto;
            padding: 0 20px;
        }

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .top h2 {
            margin: 0;
        }

        .back-btn {
            background: #111;
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            text-decoration: none;
        }

        #message {
            text-align: center;
            padding: 30px;
            color: #666;
        }

        .products {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
        }

        .card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        }

        .card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .card-content {
            padding: 16px;
        }

        .card h3 {
            margin: 0 0 8px;
        }

        .price {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .location {
            color: #666;
            margin-bottom: 12px;
        }

        .view-btn {
            display: block;
            text-align: center;
            background: #111;
            color: white;
            text-decoration: none;
            padding: 11px;
            border-radius: 7px;
        }

        .remove-btn {
            width: 100%;
            margin-top: 8px;
            padding: 10px;
            border: none;
            border-radius: 7px;
            background: #eee;
            cursor: pointer;
        }

        .empty {
            background: white;
            padding: 50px 20px;
            border-radius: 12px;
            text-align: center;
        }

        .browse-btn {
            display: inline-block;
            margin-top: 15px;
            background: #111;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            text-decoration: none;
        }
    </style>
</head>

<body>

<header>
    <h1>BUYZA</h1>

    <div>
        <a href="index.html">Home</a>
        <a href="account.html">Account</a>
    </div>
</header>


<div class="container">

    <div class="top">

        <h2>❤️ My Favorites</h2>

        <a href="index.html" class="back-btn">
            Browse Products
        </a>

    </div>

    <div id="message">
        Loading your favorites...
    </div>

    <div id="products" class="products"></div>

</div>


<!-- BUYZA automatic session refresh -->
<script src="auth.js"></script>


<script>

const SUPABASE_URL =
    "https://xbjmdsdgisusnxdmlrxh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_FiaziwSklP22XFb1vfazZw_AudR-1-J";


async function startFavorites() {

    /*
     * Refresh the Supabase session first.
     */
    const sessionOK =
        await checkBuyzaSession();


    const userData =
        localStorage.getItem("buyza_user");

    const accessToken =
        localStorage.getItem("buyza_access_token");


    if (!sessionOK || !userData || !accessToken) {

        alert("Please login to view your favorites.");

        window.location.href = "login.html";

        return;
    }


    const user =
        JSON.parse(userData);


    loadFavorites(user.id);
}


async function loadFavorites(userId) {

    const message =
        document.getElementById("message");

    const productsContainer =
        document.getElementById("products");


    const accessToken =
        localStorage.getItem("buyza_access_token");


    try {

        const response = await fetch(
            SUPABASE_URL +
            "/rest/v1/favorites?user_id=eq." +
            encodeURIComponent(userId) +
            "&select=*",
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        "Bearer " + accessToken
                }
            }
        );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }


        const favorites =
            await response.json();


        if (favorites.length === 0) {

            message.innerHTML = `
                <div class="empty">

                    <h3>
                        You haven't saved any favorites yet ❤️
                    </h3>

                    <p>
                        Browse BUYZA and save products you like.
                    </p>

                    <a href="index.html" class="browse-btn">
                        Browse Products
                    </a>

                </div>
            `;

            return;
        }


        const productIds =
            favorites
                .map(item => item.product_id)
                .join(",");


        const productResponse =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/products?id=in.(" +
                productIds +
                ")&select=*",
                {
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            "Bearer " + accessToken
                    }
                }
            );


        if (!productResponse.ok) {

            const error =
                await productResponse.text();

            throw new Error(error);
        }


        const products =
            await productResponse.json();


        message.innerHTML = "";

        productsContainer.innerHTML = "";


        products.forEach(product => {

            const image =
                product.image_url ||
                "https://via.placeholder.com/500x350?text=BUYZA";


            const card =
                document.createElement("div");

            card.className = "card";


            card.innerHTML = `

                <img
                    src="${image}"
                    alt="${escapeHtml(product.name || "Product")}"
                >

                <div class="card-content">

                    <h3>
                        ${escapeHtml(product.name || "Unnamed Product")}
                    </h3>

                    <div class="price">
                        UGX ${Number(product.price || 0).toLocaleString()}
                    </div>

                    <div class="location">
                        📍 ${escapeHtml(product.location || "Uganda")}
                    </div>

                    <a
                        href="product.html?id=${encodeURIComponent(product.id)}"
                        class="view-btn"
                    >
                        👁 View Product
                    </a>

                    <button
                        class="remove-btn"
                        onclick="removeFavorite(${product.id})"
                    >
                        ❌ Remove from Favorites
                    </button>

                </div>
            `;


            productsContainer.appendChild(card);

        });


    } catch (error) {

        console.error(error);


        message.innerHTML = `
            <div class="empty">

                <h3>
                    ❌ Unable to load favorites
                </h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>
        `;
    }
}


async function removeFavorite(productId) {

    const userData =
        localStorage.getItem("buyza_user");


    if (!userData) {

        window.location.href =
            "login.html";

        return;
    }


    const user =
        JSON.parse(userData);


    /*
     * Refresh token before deleting.
     */
    await checkBuyzaSession();


    const accessToken =
        localStorage.getItem("buyza_access_token");


    try {

        const response =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/favorites" +
                "?user_id=eq." +
                encodeURIComponent(user.id) +
                "&product_id=eq." +
                encodeURIComponent(productId),
                {
                    method: "DELETE",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            "Bearer " + accessToken
                    }
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }


        loadFavorites(user.id);


    } catch (error) {

        console.error(error);

        alert(
            "Could not remove favorite.\n\n" +
            error.message
        );
    }
}


function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


startFavorites();

</script>

</body>
</html>
