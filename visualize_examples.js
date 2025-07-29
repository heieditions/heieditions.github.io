
$(document).ready(function() {
    // preparing api call, initializing window
    $(function() {
        const {protocol, hostname, pathname} = window.location
        const opts = {
          $el: 'html',
          api: {
            endpoint: '',
            endpointLogin: '',
            endpointAnno: '',
            endpointAnnoAuth: '',
            endpointEditionen: 'https://digi.ub.uni-heidelberg.de/editionService',
            hostname: hostname,
            pathname: pathname,
            sid: '',
          },
          tei: {
            edition: 'default',
          },
        }
  
        window.app = new DigiExamplePage(opts)
        window.app.init()
    })  

    // creating buttons for each visualization example; add data attributes example id and visualization type for later api call
    var elements = document.getElementsByClassName("egxml");

    for (var i=0; i<elements.length; i++) {
        if (elements[i].hasAttribute("data-visualization-type")){
            var exampleId = elements[i].getAttribute("data-example-id")
            var div = document.createElement("div");
            div.className = "tei";
            div.setAttribute("id", exampleId)

            var button = document.createElement("button");
            button.title = "Show visualization options for this example";
            button.className = "btn-vis";
            span = document.createElement("span");
            span.className = "fa fa-eye";
            span.classList.add("item_label")

            button.appendChild(span);
            button.append(document.createTextNode("Visualisierung"));
            button.setAttribute("data-example-id", exampleId);
            button.setAttribute("data-visualization-type", elements[i].getAttribute("data-visualization-type"));
            
            elements[i].appendChild(button);
            elements[i].appendChild(div);
        }
    }

    // add eventListener(click) to button and call API with the button's data attributes (example id and visualization type) as parameters
    function buttonCallToApi(button){
        button.addEventListener("click", () => {
            if (!button.classList.contains("data-loaded")){
                var exampleId = button.getAttribute("data-example-id")
                console.log(exampleId);
                var exampleDiv = document.getElementById(exampleId)
                window.app.loadExample(exampleDiv, exampleId, button.getAttribute("data-visualization-type"));
                //loadExample([element to overwrite], [ID of example in existdb], [visualization type to be used for loading the visualization options])
                exampleDiv.setAttribute("style", "display:block")
                button.classList.add("data-loaded");
                child = button.querySelector("span")
                child.classList.replace("fa-eye", "fa-eye-slash")
            }
            else {
                var exampleId = button.getAttribute("data-example-id")
                var exampleDiv = document.getElementById(exampleId)
                exampleDiv.setAttribute("style", "display:none")
                button.classList.remove("data-loaded")
                child = button.querySelector("span")
                child.classList.replace("fa-eye-slash", "fa-eye")
            }
        })  
    }
    
    // use function buttonCallToApi on all buttons of the class btn-vis
    var buttons = document.getElementsByClassName("btn-vis");
    var arr_buttons = Array.from(buttons);
    arr_buttons.forEach(buttonCallToApi);    
});
