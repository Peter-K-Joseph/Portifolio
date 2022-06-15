const PDFStart = (nameRoute) => {
    let loadingTask = pdfjsLib.getDocument(nameRoute),
        pdfDoc = null,
        canvas = document.querySelector('#cnv'),
        ctx = canvas.getContext('2d'),
        scale = 1.5,
        numPage = 1;

    const GeneratePDF = numPage => {
        pdfDoc.getPage(numPage).then(page => {
            let viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            let renderContext = {
                canvasContext: ctx,
                viewport: viewport
            }

            page.render(renderContext);
        })
        document.querySelector('#npages').innerHTML = `Page 1 of ${numPage}`;

    }

    const PrevPage = () => {
        if (numPage === 1) {
            return
        }
        numPage--;
        GeneratePDF(numPage);
    }

    const NextPage = () => {
        if (numPage >= pdfDoc.numPages) {
            return
        }
        numPage++;
        GeneratePDF(numPage);
    }

    document.querySelector('#prev').addEventListener('click', PrevPage)
    document.querySelector('#next').addEventListener('click', NextPage)

    loadingTask.promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
        document.querySelector('#npages').innerHTML = `Page ${pdfDoc.numPages} of ${numPage}`;
        GeneratePDF(numPage)
    });

}

const getParameters = () => {
    let url = new URL(document.location.href);
    let params = []
    if (url.searchParams.get("title") == null) {
        params.push("PDF Viewer")
    } else {
        params.push(url.searchParams.get("title"))
    }

    if (url.searchParams.get("doclink") == null) {
        (document.querySelector(".alert") as HTMLElement).style.animation = "comeup .5s cubic-bezier(0.23, 1, 0.320, 1) forwards"
        document.querySelector("#alert_head").innerHTML = "Unable to open PDF"
        document.querySelector("#alert_body").innerHTML = "The parameter parsed contains an invalid or no document link"
        params.push("")
        return params
    } else {
        params.push(url.searchParams.get("doclink"))
    }
    return params

}

document.querySelector("#close").addEventListener("click", () => {
    console.log("Viewer viewable. Close modal");
    (document.querySelector(".alert") as HTMLElement).style.animation = "comeup .5s backwards";
})

document.querySelector("#roleback").addEventListener("click", () => {
    document.querySelector("body").innerHTML = `<iframe src="${getParameters()[1]}" width="100%" height="100%"></iframe>`
})

window.addEventListener('load', () => {
    const params = getParameters()
    PDFStart(params[1])
    document.querySelector("#title_display").innerHTML = params[0]
    setTimeout(() => {
        if (document.querySelector('#npages').innerHTML == "Processing...") {
            (document.querySelector(".alert") as HTMLElement).style.animation = "comeup .5s cubic-bezier(0.23, 1, 0.320, 1) forwards"
        }
    }, 2500)
});