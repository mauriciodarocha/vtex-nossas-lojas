var _stores = {
    labels: ['Estado:','Cidade:','Loja:'],
    icons: ['pointer_icon.png','pointer_icon_shadow.png'],
    sort: false,
    url: "http://"+document.location.host+"/nossaslojas/dados",
    ufs: [],
    cities: [],
    stores: [],
    city: {"AC":"Acre","AL":"Alagoas","AP":"Amapá","AM":"Amazonas","BA":"Bahia","CE":"Ceará","DF":"Distrito Federal","ES":"Espírito Santo","GO":"Goiás","MA":"Maranhão","MT":"Mato Grosso","MS":"Mato Grosso do Sul","MG":"Minas Gerais","PA":"Pará","PB":"Paraíba","PR":"Paraná","PE":"Pernambuco","PI":"Piauí","RJ":"Rio de Janeiro","RN":"Rio Grande do Norte","RS":"Rio Grande do Sul","RO":"Rondônia","RR":"Roraima","SC":"Santa Catarina","SP":"São Paulo","SE":"Sergipe","TO":"Tocantins"},
    xml:null,
    init: function()
    {
        _stores.set.browser();
        _stores.get.stores();
    },
    set:
    {
        environment: function()
        {
            _stores.set.select.state();
            _stores.set.select.city();
            _stores.set.select.store();
            _stores.place.brasil();
            _stores.place.characters();
            
            _stores.set.ufs();
        },
        select:
        {
            state: function()
            {
                var stores_div = jQuery(".stores_selection_wrapper");
                var state_div = jQuery("<div/>").addClass("state_select_wrapper");
                var label = jQuery("<label/>").addClass("state_label").text(_stores.labels[0]);
                var select = jQuery("<select/>").attr("name","uf").addClass("select_uf");
                var h3 = jQuery("<h3/>").text("Encontre sua loja").addClass("clearfix");
                
                jQuery(stores_div).empty();
                jQuery(state_div).append(label).append(select);
                jQuery(stores_div).append(h3).append(state_div);
            },
            city: function()
            {
                var stores_div = jQuery(".stores_selection_wrapper");
                var city_div = jQuery("<div/>").addClass("city_select_wrapper");
                var label = jQuery("<label/>").addClass("city_label").text(_stores.labels[1]);
                var select = jQuery("<select/>").attr("name","city").addClass("select_city");
                var option = jQuery("<option/>").text("--");
                
                jQuery(select).append(option);
                jQuery(city_div).append(label).append(select);
                jQuery(stores_div).append(city_div);
            },
            store: function()
            {
                var stores_div = jQuery(".stores_selection_wrapper");
                var store_div = jQuery("<div/>").addClass("store_select_wrapper").addClass("clearfix");
                var label = jQuery("<label/>").addClass("store_label").text(_stores.labels[2]);
                var select = jQuery("<select/>").attr("name","store").addClass("select_store");
                var option = jQuery("<option/>").text("--");
                
                jQuery(select).append(option);                
                jQuery(store_div).append(label).append(select);
                jQuery(stores_div).append(store_div);
            }
        },
        ufs: function()
        {
            if(!_stores.get.ufs()) return false;
            var ufs_list = _stores.ufs.slice();
            ufs_list.sort();
            
            var options="<option>--</option>";
            jQuery(ufs_list).each(function(ndx,item){
                options=options+"<option value=\""+item+"\">"+item+"</option>";
            });
            jQuery(".state_select_wrapper select").html(options);

        },
        cities: function(uf)
        {
            if(!_stores.get.cities(uf)) return false;
            
            var options="<option>--</option>";
            jQuery(_stores.cities).each(function(ndx,item){
                options=options+"<option value=\""+item+"\">"+item+"</option>";
            });
            jQuery(".city_select_wrapper select").html(options);

        },
        stores: function(city)
        {
            if(!_stores.get.names(city)) return false;
            
            var options="<option>--</option>";
            jQuery(_stores.stores).each(function(ndx,item){
                options=options+"<option value=\""+item+"\">"+item+"</option>";
            });
            jQuery(".store_select_wrapper select").html(options);

        },
        events: function()
        {
            jQuery(".state_select_wrapper select").bind("change",function()
            {
                var uf = this.value;
                if(uf=="--"||uf.length==0)
                {
                    jQuery(".state-wrapper").addClass("collapsed");
                    _stores.show.all_info();
                    _stores.show.all();
                    _stores.clear.cities();
                    _stores.clear.stores();
                }
                else
                {
                    // jQuery(".state-wrapper-"+uf).removeClass("collapsed");
                    _stores.show.all_info();
                    _stores.show.state(uf);
                    _stores.set.cities(uf);
                    _stores.clear.stores();
                }
            });
                
            jQuery(".city_select_wrapper select").bind("change",function()
            {
                var city = this.value;
                if(city=="--"||city.length==0)
                {
                    _stores.clear.stores();
                    _stores.show.all_info();
                }
                else
                {
                    _stores.show.info(city);
                    _stores.set.stores(city);
                }
            });
            
            jQuery(".store_select_wrapper select").bind("change",function()
            {
                var store = this.value;
                if(store=="--"||store.length==0)
                {
                    jQuery(".info-wrapper").removeClass("open").addClass("collapsed");
                    // return;
                }
                else
                {
                    jQuery(".info-wrapper").removeClass("open").addClass("collapsed");
                    _stores.show.store(store);
                }
            });
            
            jQuery(".state-title").parent().addClass("collapsed");
            jQuery(".state-title").bind("click",function(){
                if(jQuery(this).parent().hasClass("collapsed"))
                    jQuery(this).parent().removeClass("collapsed");
                else
                    jQuery(this).parent().addClass("collapsed");
            });
            
            jQuery(".store-title").parents(".info-wrapper").addClass("collapsed").addClass("clearfix");
            jQuery(".store-title").bind("click",function(){
                if(jQuery(this).parents(".info-wrapper").hasClass("collapsed"))
                {
                    jQuery(this).parents(".info-wrapper").removeClass("collapsed").addClass("open");
                    rel = jQuery(this).attr('rel');
                    if(jQuery('.map-container-'+rel).find("div").length<=0)
                    {
                        store_address = jQuery(this).attr('address');
                        map_container = jQuery('.map-container-'+rel);
                        _stores.show.map(store_address,map_container);
                    }
                }
                // else
                    // jQuery(this).parents(".info-wrapper").removeClass("open").addClass("collapsed");
            });
        },
        browser: function() // adiciona "class" ie, fx, chrome ou other no body
        {
            var browser = jQuery.browser.msie?'ie':/(chrome)/.test(navigator.userAgent.toLowerCase())?'chrome':jQuery.browser.mozilla?'fx':'other';
            var version = jQuery.browser.version.split('.').shift();
            jQuery("body").addClass(browser+" "+browser+version);
        }
    },
    get:
    {
        stores: function()
        {
            jQuery.ajax({ 
                url: _stores.url,
                success: function(data)
                {
                    var result = data.match(/<dados>([\S\s]*?)(.+)dados>/g)[0];
                    _stores.xml = _stores.convert.StringtoXML(result);
                    _stores.set.environment();
                    _stores.place.stores();
                }
            });                    
        },
        ufs: function()
        {
            var all_ufs = jQuery(_stores.xml).find("uf");
            _stores.ufs = [];
            jQuery(all_ufs).each(function(ndx,item)
            { 
                if(!_stores.ufs.inArray(jQuery(item).text())) 
                    _stores.ufs.push(jQuery(item).text());
            });
            if(_stores.ufs.length>0)
            {
                if(_stores.sort) _stores.ufs.sort();
                return true;
            }
            else return false;
        },
        cities: function(selected_uf)
        {
            if(typeof(selected_uf)=="undefined"||selected_uf=="") return false;
            
            var cities = jQuery(_stores.xml).find('uf:contains("'+selected_uf+'")').siblings("cidade");
            _stores.cities = [];
            jQuery(cities).each(function(ndx,item)
            { 
                if(!_stores.cities.inArray(jQuery(item).text()))
                    _stores.cities.push(jQuery(item).text());
            });
            if(_stores.cities.length>0)
            {
                _stores.cities.sort();
                return true;
            }
            else return false;
        },
        names: function(selected_city)
        {
            if(typeof(selected_city)=="undefined"||selected_city=="") return false;
            
            var stores = jQuery(_stores.xml).find('cidade:contains("'+selected_city+'")').siblings("info").find("nome");
            _stores.stores = [];
            jQuery(stores).each(function(ndx,item)
            { 
                if(!_stores.stores.inArray(jQuery(item).text()))
                    _stores.stores.push(jQuery(item).text());
            });
            if(_stores.stores.length>0)
            {
                // _stores.stores.sort();
                return true;
            }
            else return false;
        }
    },
    place:
    {
        stores: function()
        {

            var states_divs=jQuery(".stores_wrapper");
            var state_div,state_title,store_container,text;
            jQuery(_stores.ufs).each(function(ndx,item){
                class_name = item;
                state_div = jQuery('<div/>').addClass('state-wrapper').addClass('state-wrapper-'+class_name);
                text = _stores.city[class_name];
                state_title = jQuery('<h4/>').addClass('state-title').addClass('state-title-'+class_name).text(text);
                store_container = jQuery('<div/>').addClass('store-wrapper').addClass('store-wrapper-'+class_name);
                jQuery(state_div).append(state_title).append(store_container);
                jQuery(states_divs).append(state_div);
            });
            
            var store_div,store_title,classname,info_wrapper_div,address;
            jQuery(_stores.xml).find("loja").each(function(ndx,item){
                if(jQuery(item).find("cidade").length<=0) return false;
                
                text = jQuery(item).find("nome").text();
                text_link = text.replace(/ /g,"");
                div_classname = jQuery(item).find("cidade").text().replace(/ /g,"");
                store_classname = jQuery(item).find("nome").text().replace(/ /g,"");
                
                info_wrapper_div = jQuery('<div/>').addClass('info-wrapper').addClass('info-wrapper-'+text_link);
                info_div = jQuery('<div/>').addClass('info-container');
                
                address = jQuery('<p/>').addClass('address');
                address_text = jQuery(item).find("endereco").text();
                address_google_text = jQuery(item).find("google").text();
                address_text_br = address_text.replace(/\n/g,"<br/>");
                address_ref = address_google_text.replace(/\n/g," ");
                jQuery(address).html(address_text_br);
                
                store_title = jQuery("<h5/>").addClass('store-title').addClass('store-title-'+text_link).attr('rel',ndx).attr('address',address_ref).text(text);
                
                tel = jQuery('<p/>').addClass('tel');
                jQuery(tel).html(jQuery(item).find("telefone").text().replace(/\n/g,"<br/>"));
                
                funcionamento = jQuery('<p/>').addClass('hours');
                jQuery(funcionamento).html(jQuery(item).find("funcionamento").text().replace(/\n/g,"<br/>"));
                
                img = jQuery('<img/>').attr('src',jQuery(item).find("img").text());
                div_img = jQuery('<div/>').addClass('img-container');
                
                div_map = jQuery('<div/>').addClass('map-container').addClass('map-container-'+ndx);
                div_info_text = jQuery('<div/>').addClass('info-text-container');
                clear = jQuery('<div/>').addClass('clear');
                
                jQuery(div_img).append(img);
                jQuery(div_info_text).append(address).append(tel).append(funcionamento).append(div_img);
                jQuery(info_div).append(store_title).append(div_info_text);
                jQuery(info_wrapper_div).append(info_div).append(div_map);//.append(clear);
                
                if(jQuery('.store-container-'+div_classname).length<=0)
                {
                    store_div = jQuery('<div/>').addClass('store-container').addClass('store-container-'+div_classname);
                    jQuery(store_div).append(info_wrapper_div);
                    jQuery('.store-wrapper-'+jQuery(item).find("uf").text()).append(store_div);
                } else {
                    jQuery('.store-container-'+div_classname).append(info_wrapper_div);
                }
            });
            
            _stores.set.events();
        },
        characters: function()
        {
            var characters_div = jQuery("<div/>").addClass("characters");
            jQuery(".content_wrapper").append(characters_div);
        },
        brasil: function()
        {
            var brasil_div = jQuery("<div/>").addClass("brasil_map");
            jQuery(".content_wrapper").append(brasil_div);
        }
    },
    clear:
    {
        cities: function()
        {
            jQuery(".city_select_wrapper select").html("<option>--</option>");
        },
        stores: function()
        {
            jQuery(".store_select_wrapper select").html("<option>--</option>");
        }
    },
    show:
    {
        state: function(selected_uf)
        {
            jQuery(".state-wrapper").removeClass("open");
            jQuery(".state-wrapper-"+selected_uf).addClass("open");
            jQuery(".stores_wrapper").addClass("collapsed");
        },
        store: function(selected_store)
        {
            jQuery(".store-title-"+selected_store.replace(/ /g,"")).click();
            // jQuery(".info-wrapper").removeClass("open");
            // jQuery(".info-wrapper-"+selected_store.replace(/ /g,"")).addClass("open").removeClass("collapsed");
        },
        info: function(selected_city)
        {
            jQuery(".store-container").removeClass("open");
            jQuery(".store-container-"+selected_city.replace(/ /g,"")).addClass("open");
            jQuery(".store-wrapper").addClass("collapsed");
        },
        all_info: function()
        {
            jQuery(".store-container").removeClass("open");
            jQuery(".store-wrapper").removeClass("collapsed");
        },
        all: function()
        {
            jQuery(".state-wrapper").removeClass("open");
            jQuery(".stores_wrapper").removeClass("collapsed");
        },
        map: function(address, container)
        {
            var geocoder, results;
            var map;
            var url = document.location.protocol+"//"+document.location.host;
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': address}, function(results, status)
            {
                if (status == google.maps.GeocoderStatus.OK)
                {
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    var myLatlng = new google.maps.LatLng(lat,lng);
                    var myOptions = {
                        zoom: 15,
                        center: myLatlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map_container = jQuery(container)[0];
                    map = new google.maps.Map(map_container,myOptions);
                    var image = url+'/arquivos/'+_stores.icons[0];
                    var shadow = url+'/arquivos/'+_stores.icons[1];
                    var marker = new google.maps.Marker({
                        position: myLatlng, 
                        map: map,
                        icon: image,
                        shadow: shadow
                    });
                }
            });
        }
    },
    convert:
    {
        StringtoXML: function(text)
        {
            if (window.ActiveXObject)
            {
                var doc=new ActiveXObject('Microsoft.XMLDOM');
                doc.async='false';
                doc.loadXML(text);
            } else {
                var parser=new DOMParser();
                var doc=parser.parseFromString(text,'text/xml');
            }
            return doc;
        }
    }
}

jQuery(function(){
    _stores.init();
});

Array.prototype.inArray = function(value)
{
    // Returns true if the passed value is found in the array. Returns false if it is not.
    var i;
    for (i=0; i < this.length; i++)
        if (this[i] == value)
            return true;
    return false;
};