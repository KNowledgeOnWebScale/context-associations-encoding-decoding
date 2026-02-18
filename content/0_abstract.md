
## Abstract

<!-- context -->
Data quality is asserted through contextual metadata annotations.
However,
the association between contextual information and target data
often depends on application-specific specifications and protocol definitions,
as we see in mature annotation systems
such as nanopublications, RO-Crates, and W3C Verifiable Credentials (VCs).
These associations are not always explicit at the data level.
<!-- need -->
When, e.g., asserting data quality,
this mismatch in association methods across applications
limits uniform storage, exchange, and discovery of metadata linked to a target set of statements.
<!-- task -->
We present Context Associations:
a uniform approach to model and query
which metadata is associated with which sets of statements in an RDF dataset.
<!-- object -->
This is achieved through a lossless and reversible conversion of existing association methods into a single association model leveraging blank node graphs.
<!-- evaluation -->
We evaluate Context Associations by demonstrating that---for each of the aforementioned annotation systems---metadata statements can be uniformly associated with target statements and queried across applications.
Full reconstruction of the original formats from their Context Association representation
is feasible when application-specific implied modeling information is made explicit.
<!-- conclusion -->
By providing a uniform representation of context statements associated with target RDF statements,
we enable discovery, exchange, storage, and processing of heterogenous contextual metadata annotations.