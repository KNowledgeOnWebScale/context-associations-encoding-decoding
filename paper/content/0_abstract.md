## Abstract

<!-- context -->
Data quality is often asserted through annotations that associate contextual information with target data.
<!-- need -->
However, existing annotation approaches rely on application-specific mechanisms, as illustrated by mature systems such as DQV, nanopublications, RO-Crates, and W3C Verifiable Credentials.
In addition, some contextual information is not always made explicit at the data level.
<!-- task -->
This heterogeneity limits the uniform storage, exchange, discovery, and querying of contextual information associated with target statements.
<!-- object -->
We present Context Associations, an approach for uniformly modeling and querying associations between contextual information and statements in an RDF knowledge graph.
Our approach enables a lossless and reversible conversion of existing annotations into a single association model based on blank-node graphs.
<!-- evaluation -->
We evaluate Context Associations across the aforementioned annotation systems and show that contextual information can be uniformly associated with target statements and queried across applications.
We further show that the original formats can be fully reconstructed when application-specific implicit modeling assumptions are made explicit.
<!-- conclusion -->
By providing a uniform representation of contextual information associated with RDF statements, Context Associations supports the discovery, exchange, storage, and processing of heterogeneous annotations.
