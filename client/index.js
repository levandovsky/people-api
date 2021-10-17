const main = async () => {
    const response = await fetch("http://localhost:8080/people", {
        method: "GET"
    });

    const data = await response.json();
    console.log(data)
}

main();