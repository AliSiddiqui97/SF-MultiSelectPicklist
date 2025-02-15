/**
 * @description       : 
 * @author            : Ali Siddiqui
 * @group             : 
 * @last modified on  : 07-22-2024
 * @last modified by  : Ali Siddiqui
 * Modifications Log
 * Ver   Date         Author         Modification
 * 1.0   07-18-2024   Ali Siddiqui   Initial Version
**/
import { LightningElement, api, wire, track } from 'lwc';

export default class CustomMultiPickList extends LightningElement {

    placeholder = '';
    showDD=false;
    init = false; 
    isExpanded = false;
    isSelectAll = false;

    @api options=[];    
    @api label;
    @api required;
    @api showpills;

    renderedCallback() {
        if(!this.init) {
            this.template.querySelector('.cmpl-input').addEventListener('click', (event) => {
                if(this.showDD) {
                    this.showDD = !this.showDD;
                } else {
                    let opts = this.options ? this.options.filter((element) => element.show).length : 0;
                    this.showDD = opts > 0;
                }
                event.stopPropagation();
            });
            this.template.addEventListener('click', (event) => {
                event.stopPropagation();
            });
            document.addEventListener('click', () => {
                this.showDD = false;
            });
            this.init=true;
        }
    }

    onSearch(event) {
        this.options.forEach(option => {
            option.show = option.label.toLowerCase().startsWith(event.detail.value.toLowerCase());
        });
        let filteredopts = this.options.filter((element) => element.show);
        this.showDD = false;
        if(filteredopts.length > 0) {
            this.showDD = true;
        }      
    }

    onSelect(event) {
        if(event.target.value == 'SelectAll') {
            this.options.forEach(option => {
                option.checked = event.target.checked;
            });
        } else {
            this.options.find(option => option.label === event.target.value).checked = event.target.checked;
        } 
        this.postSelect();
    }

    onRemove(event) {
        this.options.find(option => option.label === event.detail.name).checked = false;
        this.postSelect();        
    }

    postSelect() {
        let count = this.options.filter((element) => element.checked).length;
        this.placeholder = count > 0 ? count+ ' Item(s) Selected' : '';
        this.isSelectAll = (count == this.options.length);
        if(this.showpills) {
            let evnt = setInterval(() => {
                if(count > 1){
                    if(this.template.querySelector('[role="listbox"]').getBoundingClientRect().height > 
                        (this.template.querySelectorAll('[role="pill"]')[0].getBoundingClientRect().height+10)) {
                        this.template.querySelector('[role="more"]').classList.remove('slds-hide');
                    } else {
                        this.template.querySelector('[role="more"]').classList.add('slds-hide');
                    }
                }
                clearInterval(evnt);
            }, 200);
        }
        if(this.required) {
            if(count == 0) {
                this.template.querySelector('.cmpl-input').setCustomValidity('Please select item(s)');
            } else {
                this.template.querySelector('.cmpl-input').setCustomValidity('');
            }            
            this.template.querySelector('.cmpl-input').reportValidity();
        }
        
    }

    get showPillView() {
        if(this.showpills) {
            let count = this.options ? this.options.filter((element) => element.checked).length : 0;
            return this.showpills && count > 0;
        }
        return false;
    }

    showMore() {
        this.template.querySelector('.slds-listbox_selection-group').classList.add('slds-listbox_expanded');
        this.template.querySelector('[role="more"]').classList.add('slds-hide');
        this.template.querySelector('[role="less"]').classList.remove('slds-hide');
    }

    showLess() {
        this.template.querySelector('.slds-listbox_selection-group').classList.remove('slds-listbox_expanded');
        this.template.querySelector('[role="less"]').classList.add('slds-hide');
        this.template.querySelector('[role="more"]').classList.remove('slds-hide');
    }

    @api
    getSelectedList() {
        return this.options.filter((element) => element.checked).map((element) => element.value).join(';');
    }

    @api
    setSelectedList(selected) {
        selected?.split(';').forEach(name => {
            this.options.find(option => option.label === name).checked = true;
        });
        this.postSelect();
    }

    @api
    setOptions(opts,required,showpills) {
        this.options = opts.map(opt => {return {"label": opt.label, "value": opt.value, "show": true, "checked":false}});
        this.required = required;
        
        this.showpills = showpills;
    }

    @api
    isValid() {
        if(this.required) {
            let count = this.options ? this.options.filter((element) => element.checked).length : 0;
            if(count == 0) {
                this.template.querySelector('.cmpl-input').setCustomValidity('Please select item(s)');
                this.template.querySelector('.cmpl-input').reportValidity();
                return false;
            }            
        }
        return true;
    }

}