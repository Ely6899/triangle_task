document.getElementById("triangleForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const ax = document.getElementById("ax").value;
    const ay = document.getElementById("ay").value;
    const bx = document.getElementById("bx").value;
    const by = document.getElementById("by").value;
    const cx = document.getElementById("cx").value;
    const cy = document.getElementById("cy").value;

    // Build query string
    const url = `triangle.html?ax=${ax}&ay=${ay}&bx=${bx}&by=${by}&cx=${cx}&cy=${cy}`;
    window.location.href = url;
});