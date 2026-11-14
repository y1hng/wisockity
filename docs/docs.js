const documents = {
    overview: { file: "index.md", label: "Overview" },
    modules: { file: "modules.md", label: "Modules" },
    protocol: { file: "protocol_spec.md", label: "Protocol spec" }
};

async function renderDocument(key, updateAddress = true) {
    const selected = documents[key] ? key : "overview";
    const documentInfo = documents[selected];
    const content = document.querySelector("#document-content");

    document.querySelectorAll(".doc-link").forEach((link) => {
        link.setAttribute("aria-current", link.dataset.document === selected ? "page" : "false");
    });
    content.setAttribute("aria-busy", "true");
    content.textContent = "";
    const loading = document.createElement("p");
    loading.className = "doc-loading";
    loading.textContent = `Reading ${documentInfo.file}`;
    content.append(loading);

    if (updateAddress && location.hash !== `#${selected}`) {
        history.pushState({ document: selected }, "", `#${selected}`);
    }

    try {
        const response = await fetch(`./${documentInfo.file}`);
        if (!response.ok) throw new Error(`Markdown request failed (${response.status})`);
        const markdown = await response.text();
        if (!window.marked || !window.DOMPurify) throw new Error("Markdown renderer unavailable");

        const rendered = window.marked.parse(markdown, { gfm: true, breaks: false });
        content.innerHTML = window.DOMPurify.sanitize(rendered);
        content.querySelectorAll("a[href$='.md']").forEach((link) => {
            const target = Object.entries(documents).find(([, info]) => info.file === link.getAttribute("href"));
            if (target) {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    renderDocument(target[0]);
                });
            }
        });
        document.title = `${documentInfo.label} / Wisockity`;
    } catch (error) {
        content.replaceChildren();
        const message = document.createElement("div");
        message.className = "doc-error";
        const heading = document.createElement("strong");
        heading.textContent = "Documentation could not be loaded.";
        const detail = document.createElement("p");
        detail.textContent = location.protocol === "file:"
            ? "Serve the project over HTTP to allow the page to fetch Markdown files."
            : "Check that the Markdown files and renderer libraries are available.";
        const source = document.createElement("a");
        source.href = documentInfo.file;
        source.textContent = "Open the Markdown source";
        message.append(heading, detail, source);
        content.append(message);
        console.error(error);
    } finally {
        content.setAttribute("aria-busy", "false");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".doc-link").forEach((link) => {
        link.addEventListener("click", () => renderDocument(link.dataset.document));
    });
    window.addEventListener("popstate", () => renderDocument(location.hash.slice(1), false));
    renderDocument(location.hash.slice(1) || "overview", false);
});
