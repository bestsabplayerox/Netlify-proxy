export default async (request, context) => {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
        return new Response("No URL provided.", { status: 400 });
    }

    try {
        // Fetch the target website
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0",
            }
        });

        // Copy the headers so we can modify them
        const newHeaders = new Headers(response.headers);

        // Son change this if it errors
        newHeaders.delete("x-frame-options");
        newHeaders.delete("content-security-policy");
        newHeaders.delete("x-content-type-options");
        newHeaders.set("access-control-allow-origin", "*");

        return new Response(response.body, {
            status: response.status,
            headers: newHeaders,
        });

    } catch (error) {
        return new Response("Proxy error: Could not load the website.", { status: 500 });
    }
};
