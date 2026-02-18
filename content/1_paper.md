# [title TO DO]

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

## Introduction

Data quality is asserted through contextual metadata annotations.
For example,
in the World Wide Web Consortium's Data Quality Vocabulary (DQV) [citeneeded],
quality is represented as subject-bound annotations of type `dqv:QualityAnnotation` or `dqv:QualityMeasurement`
that directly link contextual (data quality) metadata to target datasets or distributions via the prediate.
Within this scope, the dataset is described as a DCAT dataset,
so when integrating both the contextual metadata as the target data in a triplestore,
it is hard to distinguish metdata from the target data
(especially when, e.g., the quality measurents themselves also haven contextual metadata annotations).

We see that
the association between contextual information and target data
often depends on application-specific specifications and protocol definitions,
as we see in mature annotation systems
such as DQV [cite spec], nanopublications [footnote], RO-Crates [footnote], and W3C Verifiable Credentials (VCs) [cite spec].

In DQV, contextual information is associated through specific triples typed as class `dqv:QualityAnnotation` or `dqv:QualityMeasurement`
with the relations `oa:hasTarget` (reusing the Web Annotation association model) or `dqv:computedOn` to the target dataset or distribution, respectively [cite spec or better].
In the Nanopublication specification, contextual information is associated
through explicit graph structuring:
nanopublication is composed of four named graphs---Head, Assertion, Provenance, and PublicationInfo---and
the Head graph uses predicates such as np:hasAssertion, np:hasProvenance, and np:hasPublicationInfo to relate the nanopublication resource to its constituent graphs [cite spec].
In RO-Crate, contextual information is associated implicitly
through the JSON-LD graph structure of the RO-Crate Metadata Document using existing vocabularies (e.g., Schema.org) where relationships between entities (e.g., dataset → file, file → creator) are encoded as linked properties in the `@graph` [cite spec].
In the VC Data Model specification, contextual information is associated through an explicit credential structure: a verifiable credential is composed of core properties such as `credentialSubject` to link to the identified subject resource, and `proof` to bind the credential to a cryptographic verification method [cite spec].
Through JSON-LD expansion and with accompanying W3C CCG Note “RDF Dataset Canonicalization and Hashing” and related Data Integrity specifications, Verifiable Credentials can be interpreted as RDF datasets for the purpose of canonicalization and cryptographic proof generation [cite spec].

As can be seen,
these association methods are not aligned and not always explicit at the data level.
When, e.g., asserting data quality,
this mismatch in association methods across applications
limits uniform storage, exchange, and discovery of metadata linked to a target set of statements.

In this paper, we present Context Associations:
an approach and associated specification and tooling
to uniformly model and query
which metadata is associated with which sets of statements in an RDF dataset.
Context Associations is available at [link to landing page?].

To achieve a uniform queryable metadata association method,
i.e., merging contextual metadata annotations and their target data from multiple applications into a single queryable triplestore,
we put forward the following requirements:

<!-- Requirements from where? -->
<!--
- queryable -> part of RDF data model
  - should support set of statements
- immutable interpretation (i.e. no side-effects from merging with other data)
  - must use blank node
- recursive/chaining -> metadata of metadata
- RDF support: triple, triple term, quad
  - default graph via bnode
  - named graphs renamen via bnode -> is opnieuw metadata
  - multiple graphs?
-->

- REQ1: the solution is **interoperable** and implement-independent: no extensions to RDF or SPARQL are needed and any existing triplestore can be used.
- REQ2: target data can be **any arbitrary set of statements**: target data is not bound to a single specific subject or graph, and can have any existing RDF 1.1 (and upcoming RDF 1.2) statements, i.e., target data can contain any combination of triples, graphs, and triple terms.
- REQ3: contextual metadata annotations are **explicit**: the annotations and target data are both available in the triplestore.
- REQ4: contextual metadata annotations are **immutable**: there cannot be collissions or other side-effects from merging annotations from multiple applications.
- REQ5: contextual metadata annotations can be **recursive**: annotations themselves can be annotated. As a result, also contextual metadata annotations can be any arbitrary set of statements (see REQ2).

## SoTA

Over the years, many data-modeling approaches are introduced for annotating contextual metadata,
mostly using RDF reification, named graphs, and triple terms.
Solutions such as tSPARQL are left out of scope as these require SPARQL extensions and are thus not interoperable.

The work of Müller et al. [Müller2019EvaluationMetatdataRepresentations] gives an overview
of metadata representation models that are part of the RDF model, namely,
RDF reification, singleton properties, and named graphs.
They conclude that while reification offers fine-grained statement-level annotation,
it incurs significant verbosity and complexity, whereas
named graphs provide a more practical and widely supported mechanism
for grouping statements and attaching contextual metadata at the graph level.
Overall, they argue that no single approach is universally optimal, and
that the choice of representation depends on the required granularity of annotation and
the intended processing environment.

Since then and with the upcoming standardization work of RDF 1.2,
triple terms (formerly known as RDF-Star) were introduced to provide annotations to individual triples.
Triple terms can be understood as addressing the verbosity and usability limitations of reification
while retaining its expressivity at the individual statement level.

TODO
- metadata representation models - part of RDF
  - too light on existing syntaxes for RDF reification
  - specific for hashes: VC model (adopted!), trustyuri > RDF Dataset Canonicalization (work of Braun)

TODO complement with current association models within the protocol: subject-based referencing, graph-based referencing, out-of-band referencing.

## Method

TODO include table that gives overview of (✅, ❓, or ❌)

- reification
- singleton property
- combination default graph and named graphs (also VC)
- named graphs (also nanopub)
- application model (subject-based, also dqv, web annotation)
- Context Associations

for requirements

- interoperable (✅, ❓= needs protocol-specific queries, ❌ = RDF/SPARQL needs extensions)
- RDF support (✅, ❓= only one triple/only triples associated to one subject/only triples/only triples and quads/...)
- explicit (✅, or ❌)
- immutable (✅, or ❌)
- recursive (✅, or ❌)

tSPARQL and RO-Crate are taken out of scope as tSPARQL needs custom extensions and RO-Crate's association model is outside the scope of the RDF data.

<!-- me thinks it's gonna look something like this -->

|               | Reification              | Singleton property       | Default graph and named graph (e.g. VC)  | Named graphs (e.g. Nanopub)   | Per-subject linking (see dqv and Web Annotation) | Context Associations |
|---------------|--------------------------|--------------------------|------------------------------------------|-------------------------------|--------------------------------------------------|----------------------|
| Interoperable | ✅                       | ✅                       | ❓                                       | ❓                            | ❓                                                    | ✅                    |
| RDF Support   | ❓: only one triple      | ❓: only one triple      | ❓: only triples/triple terms            | ❓: only triples/triple terms | ❓: only triples per subject                          | ✅                    |
| Explicit      | ✅                       | ✅                       | ✅                                       | ✅                            | ✅                                                    | ✅                    |
| Immutable     | ✅ (if using unique ids) | ✅ (if using unique ids) | ❌: default graph collisions             | ✅ (if using unique ids)      | ✅ (if using unique ids)                              | ✅                    |
| Recursive     | ✅                       | ✅                       | ❌: default graph                        | ✅                            | ✅                                                    | ✅                    |

TODO: explain: metadata as graph, within that graph point to 'target' graph
for sharing as a package

## Demonstration

piece of code to translate an example nanopub to context associations
piece of code to translate an example RO-Create to context associations
piece of code to translate an example VC to context associations
merge all outputs in a triplestore
one query to show 'what types of metadata are asociated with my target data'
reverse piece/pieces of code to translate context associations to originals

We demonstratie that---for each of the aforementioned annotation systems---metadata statements can be uniformly associated with target statements and queried across applications.
Full reconstruction of the original formats from their Context Association representation
is feasible when application-specific implied modeling information is made explicit.

## Conclusion

Context Associations is an approach and associated specification and tooling
that allows to more explicitly state how context is associated with target RDF data, using default RDF 1.1 features.
Where other systems introduce custom association methods, do not support annotating all types of RDF statements, or introduce the risk of collisions when merging different metadata in a single triplestore,
Context Associations can be used to losslessly convert data coming from these other systems into a single model.
We show how Context Associations allows you to merge all kinds of data in a single RDF store and use a single query to discover which types of metadata are associated with which target data, across all original systems.

By providing a uniform representation of context statements associated with target RDF statements,
we enable discovery, exchange, storage, and processing of heterogenous contextual metadata annotations.

## References

[Müller2019EvaluationMetatdataRepresentations]: Frey, J., Müller, K., Hellmann, S., Rahm, E., Vidal, M.-E.: Evaluation of metadata representations in RDF stores. Semantic Web. 10, 205–229 (2019).