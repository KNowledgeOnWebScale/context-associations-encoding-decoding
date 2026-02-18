# Rewrite planning for 2026

# Abstract 
<!-- context -->
The Resource Description Framework (RDF) has inspired many data-modeling approaches for annotating contextual metadata about data, ranging from descriptions of external resources to internal annotations via RDF reification, named graphs, and triple terms.
<!-- need -->
In many annotation systems, such as nanopublications, RO-Crates, W3C Verifiable Credentials (VCs), and ODRL policies, the association between contextual information and target data depends on system-specific interpretations that are often specified out of band in specifications and protocol definitions. As a result, these associations are not explicitly represented at the data level, which limits uniform storage, exchange, and discovery of metadata linked to a target set of statements across systems.
<!-- task -->
To address this, we present Context Associations as a uniform approach for modeling and querying which metadata is associated with which sets of statements in an RDF dataset. This is achieved through a lossless and reversible conversion of existing data models into a single association model.
<!-- object -->
We show that, for the annotation mechanisms mentioned above, such conversion may require explicitly modeling information that is implicit in the source model and its specification.
<!-- evaluation -->
We evaluate the approach by demonstrating that, for each of these annotation mechanisms, metadata statements can be uniformly associated with target graphs and external resources and queried in a common way, while retaining the ability to fully reconstruct the original formats from their representation as Context Associations in an RDF dataset.
<!-- conclusion -->
By providing a uniform representation of context statements associated with target RDF triples, we enable discovery, exchange, storage, and processing of heterogeneous RDF-based artifacts within a single data source.
