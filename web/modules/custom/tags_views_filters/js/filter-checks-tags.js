Drupal.behaviors.fiterTags = {
    attach(context) {

      const containerElementViews = document.querySelector('.views-element-container');
      
      if(containerElementViews){

        let contentTags = document.querySelector('.selected-tags');
        if(!contentTags){
            //create content for tags generate
            const divTags = document.createElement('div');
            divTags.classList.add('selected-tags');
            containerElementViews.insertBefore(divTags,containerElementViews.firstChild);

            contentTags = document.querySelector('.selected-tags');
        }
        
            
        const formFilters = document.querySelector('.tags-filters');

        const buttonFilter = formFilters.querySelector('input[type="submit"]');

        if (buttonFilter) {

            
            const createTagElement = (filterId, nameTag) => {
                const span = document.createElement('span');
                span.classList.add('tag--filter');
                span.dataset.filterId = filterId;
                span.innerHTML = `${nameTag}<svg width="100%" height="100%" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path d="M3.254,4.002l-2.549,-2.656c-0.191,-0.199 -0.185,-0.516 0.014,-0.707c0.199,-0.191 0.516,-0.184 0.707,0.015l2.539,2.645l2.683,-2.654c0.197,-0.195 0.513,-0.193 0.707,0.003c0.195,0.197 0.193,0.513 -0.003,0.707l-2.694,2.665l2.528,2.634c0.191,0.199 0.185,0.516 -0.014,0.707c-0.199,0.191 -0.516,0.184 -0.707,-0.015l-2.518,-2.623l-2.595,2.567c-0.197,0.194 -0.513,0.193 -0.707,-0.004c-0.195,-0.196 -0.193,-0.513 0.003,-0.707l2.606,-2.577Z"></path></svg>`;
                return span;
            };

            const form = buttonFilter.form;
            
            
            const formCheckboxes = form.querySelectorAll('input[type="checkbox"]');
            const formSubmit =
            form.querySelector('.form-actions input[type="submit"]') ?? null;

            //add tag in container and remove tag if checked false
            Array.from(formCheckboxes).forEach((check) => {
                
                check.addEventListener('click', (e) => {
                    if(check.checked === false)
                    {
                        const tagRemove = contentTags.querySelector(`[data-filter-id="${check.name}"]`);
                        if(tagRemove)
                            tagRemove.remove();
                    }else{
                        console.log(check.name);
                        const labelTag = form.querySelector(`label[for="${check.id}"]`);
                        const newTag = createTagElement(check.name, labelTag.innerText);
                        console.log(newTag);
                        contentTags.appendChild(newTag);
                    }
                    
                    formSubmit.click();
                });
            });

            //remove tags generate and checked false
            contentTags.addEventListener('click', function(event) {
                
                const filterId = event.target.dataset.filterId;
                console.log(filterId);
                if(filterId){
                    const check = form.querySelector(`input[name="${filterId}"]`);
                    check.checked = false;
                    event.target.remove();
                    formSubmit.click();
                }
                
            });

        }
      }
      
  
    },
};


  