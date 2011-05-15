var MendeleyAPI = require('./mendeley');

var m = new MendeleyAPI('put-your-key-here');

// Get the top 20 documents tagged with physics.
var tagged = m.tagged('physics');
tagged.on('success', function(documents) {
    documents.forEach( function (doc) {
        console.info(doc.uuid)
	/** This looks up the related items for the tagged documents in parallel,
            works well in node, but quickly eats up the 150 req/h limit.
        var rel = m.related(item.uuid);
        rel.on('success', function(documents) {
            documents.forEach( function (item, el, array) { console.info (item); } );
        });
	**/
    });
});

// Get the top related documents to the given canonical id
var related = m.related('f73abfc0-6d09-11df-a2b2-0026b95e3eb7');
related.on('success', function(docs) {
    docs.forEach( function(doc) {
        console.info(doc.uuid);
    });
});
