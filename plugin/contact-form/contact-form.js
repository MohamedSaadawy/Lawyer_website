
    /*****************************************************************/
    /*****************************************************************/

    function submitContactForm()
    {
        blockForm('contact-form','block');
        $.post('plugin/contact-form/contact-form.php',$('#contact-form').serialize(),submitContactFormResponse,'json');
    }

    /*****************************************************************/

    function submitContactFormResponse(response)
    {
        blockForm('contact-form','unblock');
        $('#contact-form-name,#contact-form-phone,#contact-form-mail,#contact-form-message,#contact-form-send').qtip('destroy');

        var tPosition=
        {
            'contact-form-name':{'my':'right center','at':'left center'},
			'contact-form-phone':{'my':'right center','at':'left center'},
            'contact-form-mail':{'my':'right center','at':'left center'},
            'contact-form-send':{'my':'right center','at':'left center'},
            'contact-form-message':{'my':'right center','at':'left center'}
        };

        if(typeof(response.info)!='undefined')
        {	
            if(response.info.length)
            {	
                for(var key in response.info)
                {
                    var id=response.info[key].fieldId;
                    $('#'+response.info[key].fieldId).qtip(
                    {
                            style:      { classes:(response.error==1 ? 'ui-tooltip-error' : 'ui-tooltip-success')},
                            content: 	{ text:response.info[key].message },
                            position: 	{ my:tPosition[id]['my'],at:tPosition[id]['at'] }
                    }).qtip('show');				
                }
            }
        }
    }

    /*****************************************************************/
    /*****************************************************************/