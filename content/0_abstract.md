
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


<!-- 

Abstract sent via mail:

 The Resource Description Framework has inspired many data-modeling approaches for annotating contextual information about data, ranging from descriptions of external resources to internal annotations via RDF reification, named graphs, and triple terms. In many annotation systems, such as nanopublications, RO-Crates, W3C Verifiable Credentials, and ODRL policies, the association between contextual information and target data depends on system-specific interpretations that are often specified out of band in specifications and protocol definitions. As a result, these associations are not explicitly represented at the data level, which limits uniform storage, exchange, and discovery of contextual information associated with a target set of statements across systems. To address this, we present Context Associations as a uniform approach for modeling and querying which contextual information is associated with which sets of statements in an RDF dataset. This is achieved through a lossless and reversible conversion of existing data models into a single association model. We show that, for the annotation mechanisms mentioned above, such conversion may require explicitly modeling information that is implicit in the source model and its specification. We evaluate the approach by demonstrating that, for each of these annotation mechanisms, contextual information can be uniformly associated with target graphs and external resources and queried in a common way, while retaining the ability to fully reconstruct the original formats from their representation as Context Associations in an RDF dataset. By providing a uniform representation of context statements associated with target RDF triples, we enable discovery, exchange, storage, and processing of heterogeneous RDF-based artifacts within a single data source.

 -->