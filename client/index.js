const form = document.getElementById("form");
const list = document.getElementById("list");

const url = "http://localhost:8080/people-mongo/";

const addPerson = async (name, age) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            age,
        }),
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error);
    }

    return data.added;
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const [name, age] = data.values();

    const added = await addPerson(name, age);
    const li = document.createElement("li");
    li.innerHTML = `Added: ${added.name}`;
    list.appendChild(li);
});

const main = async () => {
    const response = await fetch(url, {
        method: "GET",
    });

    const people = await response.json();

    for (const {name, age} of people) {
        const element = document.createElement("li");
        element.innerHTML = `Name: ${name}. Age: ${age}`;
        list.appendChild(element);
    }
};

main();
