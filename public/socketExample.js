$(function() {
	var socket = io.connect(window.location.protocol + "//" + window.location.host);
    if (local) {
    }



    var MutationObserver = window.WebKitMutationObserver;

    var target = document.querySelector('#display');

    var disable = false;

    var observer = new MutationObserver(function(mutations) {
    	mutations.forEach(function(mutation) {
    		// console.log('old', mutation.oldValue);
    		// console.log('new', mutation.target.style.cssText);
    		// console.log($(mutation.target));
    		if (!disable) {
    			socket.emit('styleUpdate', {'css': mutation.target.style.cssText, 'elementId':mutation.target.id})
    			disable = true;
    		}
    	});    
    });

    var config = { attributes: true, childList: true, characterData: true, attributeOldValue: true }

    observer.observe(target, config);

    // target.addEventListener('click', function(ev) {
    // 	target.style.color = 'green';
    // 	return false;
    // }, false);

	socket.on('update', function (data) {
		console.log(data);
		//$('#'+data.elementId).attr('style', data.css);
	})
})