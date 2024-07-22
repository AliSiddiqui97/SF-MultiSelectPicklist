# SF-MultiSelectPicklist


HTML


<div class="slds-p-horizontal_small">
    <c-custom-multi-pick-list 
        label={service.label} 
        required="true" 
        showpills="true" 
        role='multiPicklist'>
    </c-custom-multi-pick-list>
</div>

JS:

this.template.querySelector('[role="multiPicklist"]').setOptions(this.unitOptions,false ,true);
