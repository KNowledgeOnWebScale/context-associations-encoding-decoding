## Abstract

<!-- context -->
Data quality is typically asserted through annotation:
associating contextual information with target data.
However, association methods
rely on application-specific specifications and protocol definitions,
as we see in mature annotation systems
such as DQV, nanopublications, RO-Crates, and W3C Verifiable Credentials (VCs).
Not all contextual information is always explicitly described at the data level.
<!-- need -->
When, e.g., asserting data quality,
this mismatch in association methods across applications
limits uniform storage, exchange, and discovery of contextual information associated to a target set of statements.
<!-- task -->
We present Context Associations:
an approach
to uniformly model and query
which contextual information is associated with which statements in an RDF Knowledge Graph.
<!-- object -->
This is achieved through a lossless and reversible conversion of existing annotations into a single association model leveraging blank node graphs.
<!-- evaluation -->
We evaluate Context Associations by demonstrating that---for each of the aforementioned annotation systems---contextual information can be uniformly associated with target statements and queried across applications.
Full reconstruction of the original formats from their Context Association representation
is feasible when application-specific implied modeling information is made explicit.
<!-- conclusion -->
By providing a uniform representation of contextual information associated with target RDF statements,
we enable discovery, exchange, storage, and processing of heterogenous annotations.
