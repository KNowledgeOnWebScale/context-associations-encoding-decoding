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

We see that the association between contextual information and target data
often depends on application-specific specifications and protocol definitions,
as we see in mature annotation systems such as DQV [](cite:cites w3c-dqv-20161215), nanopublications [^nanopublications], 
RO-Crates [^rocrates], and W3C Verifiable Credentials (VCs) [](cite:cites w3c-vc-data-model-2-20250515).

[^nanopublications]: Nanopublication Guidelines: https://nanopub.net/guidelines/working_draft/
[^rocrates]: RO-Crate Metadata Specification: https://w3id.org/ro/crate/1.2 

In DQV, contextual information is associated through specific triples typed 
as class `dqv:QualityAnnotation` or `dqv:QualityMeasurement` with the relations 
`oa:hasTarget` (reusing the Web Annotation association model) or 
`dqv:computedOn` to the target dataset or distribution, respectively [cite spec or better].
In the Nanopublication specification, contextual information is associated
through explicit graph structuring: nanopublication is composed of four named 
graphs---Head, Assertion, Provenance, and PublicationInfo---and
the Head graph uses predicates such as `np:hasAssertion`, `np:hasProvenance`, and `np:hasPublicationInfo` 
to relate the nanopublication resource to its constituent graphs [cite spec].
In RO-Crate, contextual information is associated implicitly
through the JSON-LD graph structure of the RO-Crate Metadata Document using existing vocabularies (e.g., Schema.org) where relationships between entities (e.g., dataset → file, file → creator) are encoded as linked properties in the `@graph` [cite spec].
In the VC Data Model specification, contextual information is associated through an explicit credential structure: a verifiable credential is composed of core properties such as `credentialSubject` to link to the identified subject resource, and `proof` to bind the credential to a cryptographic verification method [cite spec].
Through JSON-LD expansion and with accompanying W3C CCG Note “RDF Dataset Canonicalization and Hashing” and related Data Integrity specifications, Verifiable Credentials can be interpreted as RDF datasets for the purpose of canonicalization and cryptographic proof generation [cite spec].

<!-- ODRL? -->
Finally, the Open Digital Rights Language (ODRL) specification defines the resource to which the policy is associated either through a `odrl:hasPolicy` predicate, defined over the resource, or inveresely the resource can be linked from the policy using the `odrl:target` property. This policy target is defined in the specification as a resource or a collection of resources that are the subject of a Rule.
<!-- ODRL? -->
<!-- Data Cube Vocabulary? https://www.w3.org/TR/vocab-data-cube/ -->

As can be seen, these association methods are not aligned and not always explicit at the data level.
When, e.g., asserting data quality, this mismatch in association methods across applications
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

The work of Müller et al. [](cite:cites frey2019evaluation) gives an overview
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

In this work, we will evaluate the metadata annotation methods available in RDF.

[todo: semantics discussions?]

### Reification
The concept of reification was introduced with version 1.0 of the RDF specification [https://www.w3.org/TR/rdf-mt/#Reif] and RDF Schema vocabulary [https://www.w3.org/2001/sw/RDFCore/TR/WD-rdf-schema-20030117/#ch_reificationvocab], as a way to deconstruct triples to a set of triples defining the subject, predicate and object of the reified triple. Sharing a subject, this set of reified triples can then be referenced by metadata in the RDF graph.

### Singleton property
Singleton properies are a proposed method in RDF to overload a triple predicate, similar to the working of Labeled Property Graphs [TODO:cite], 
in which the predicate is replaced by an instanced predicate, derived from the original predicate, that can be referenced in other statements to associate contextual information to the original relation.

### Named graphs
Named graphs were introduced in the RDF syntax with version 1.1 of the RDF specification [todo:cite].
Many specifications, such as Nanopublications [^nanopublications], 
make use of these named graphs to organize their contents and associated context in these graphs.

### Hybrid use of named graph and default graph
Specifications such as W3C Verifiable Credentials [cite], generate metadata assocaitions 
that annotate the contents of the default graph, making use of named graphs to store the metadata definitions.
This allows them to provide a consistent JSON structure, while also being interoperable with RDF through JSON-LD.
However, this reliance on the default graph breaks the  is lost when merging the credential into RDF Knowledge Graphs.

### Shapes
Shape expressions such as SHACL [todo:cite] and SHEX [todo:cite] can be used to define a specific selection of data 
in an RDF dataset. Specifically, closed shapes in SHACL can be used, with prior work of converting shape expressions to
SPARQL queries to perform said extraction [todo:find-and-cite].

### URI references
Finally, most data models aimed at annotating information using the Resource Description Framework (RDF),
use the RDF default graph to annotate external resources using triple statements, used by models such as 
ODRL, DCAT and most other prevalent annotation models.
The exact interpretation of how the target resources should be interpreted by a client, depend on the 
specification associated to the annotation vocabulary, but is well understood to default to HTTP dereferencing.
[TODO: this needs to incorporate more that pretty much all triples including links to external resources can be interpreted as this]



## Context Associations
With Context Associations, our aim is to provide a general approach for modeling associations
of context to target data in RDF knowledge graphs, that can be contained within both the RDF 1.1 
syntax and be queried through SPARQL 1.1 to extract data with all associated metadata from RDF graphs.




## Demonstration


### RO-Crate
piece of code to translate an example RO-Create to context associations

### Nanopublication
piece of code to translate an example nanopub to context associations
  Nanopublication stating that 

### Verifiabe credentials
piece of code to translate an example VC to context associations
  VC defining author associated with university.

### ODRL Policy


merge all outputs in a triplestore
one query to show 'what types of metadata are asociated with my target data'
reverse piece/pieces of code to translate context associations to originals

We demonstratie that---for each of the aforementioned annotation systems---metadata statements can be uniformly associated with target statements and queried across applications.
Full reconstruction of the original formats from their Context Association representation
is feasible when application-specific implied modeling information is made explicit.

## SPARQL evaluation

Through SPARQL 1.1 evaluation, we face two problems when evaluating context assocations making use of named graphs in RDF Datasets.
The first problem is that the only way we can support the evaluation of the metadata chains through SPARQL is by making use of the property-paths in SPARQL. These however are not supported over named graphs, only in the default graph or within a single named graph.
Therefor, we first need to extract the anchor triples into the default graph.

<figure id="my-code" class="listing">
```PREFIX ca: <https://w3id.org/context-associations>
CONSTRUCT { ?source ca:about ?target }
WHERE { GRAPH ?source { ?source ca:about ?target } }```
<figcaption markdown="block">
Extraction of the anchor triples into the default graph.
</figcaption>
</figure>

Over this set of anchoring triples, we can now evalaute the chains using the SPARQL property paths.
<!-- This can either be done by maintaining a separate index as well, or creating it ad-hoc, since we cannot extract the full graphs yet anyways. -->
And here we encounter the second problem, in the lack of native support for creating named graphs as the ouput of a SPARQL Construct evaluation.
The `GRAPH` keyword is only supported in the `WHERE` clause of a SPARQL query, but not in the `CONSTRUCT` clause.
Because of this, the exctraction of all graphs in a metadata chain from an RDF Dataset requires multiple separate iterations in SPARQL 1.1. 
The first step is the extraction of all named graph identifiers that chain towards a target graph.
This target named graph can be pointed to either by it's name identifier, or through a triple matching using the `GRAPH` keyword.
Since the property path operator `*` matches chains from length zero, it will also match the target named graph containing the data.

<figure id="my-code" class="listing">
```PREFIX ca: <https://w3id.org/context-associations>
SELECT ?source WHERE {
  GRAPH ?target { <subj> <pred> <obj> . }
  ?source ca:about* ?target .
}
```
<figcaption markdown="block">
Extraction of the metadata named graph chain.
</figcaption>
</figure>

Finally, the extraction of the individual graphs from the graph store, requires an iteration over every extracted graph identifier
in the previous step, which is then constructed as the output graph.

<figure id="my-code" class="listing">
FOR EACH <graph> in extractedGraphs: 
<graph> {
```PREFIX ca: <https://w3id.org/context-associations>
CONSTRUCT { ?subj ?pred ?obj }
WHERE { GRAPH <graph> { ?subj ?pred ?obj } }
```
}
<figcaption markdown="block">
Extraction of the individual graphs
</figcaption>
</figure>



**APACHE JENA ARQ**
To solve the problems encountered in the extraction of the metadata chains, especially the lack of support for constructing graphs, which is impossible to work around in the native SPARQL evaluation, we can make use of the ARQ query engine provided by Apache Jena [TODO:CITE].
This SPARQL processor provides two functions that extend beyond the SPARQL specification, which allow us to perform the extraction in a single iteration.

Firstly, where the extraction of anchor triples can be worked around by storing them in the default graph, 
with ARQ can work around this problem making use of a provided union graph, under the identifier `urn:x-arq:UnionGraph`. 
This is a materialized union of the named graphs present in the queried RDF dataset, which allows us to extract the anchor triples from all graphs in one iteration. Secondly, ARQ supports the creation of named graphs in the `CONSTRUCT` clause of a SPARQL query. 
This enables us to directly re-create the named graphs in the metadata chain, without having to iterate separately over each graph.


<figure id="my-code" class="listing">

```
PREFIX ca: <https://w3id.org/context-associations>
CONSTRUCT { GRAPH ?g { ?s ?p ?o } } 
WHERE {
  GRAPH ?target { <x> <y> <z> . }
  GRAPH <urn:x-arq:UnionGraph> {
    ?source ca:about* ?target .
  }
  GRAPH ?source { ?s ?p ?o }
}```
<figcaption markdown="block">
Extraction of the named graphs metadata chains with a single construct query using Apache Jena ARQ.
</figcaption>
</figure>





## Comparison

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

## Conclusion

Context Associations is an approach and associated specification and tooling
that allows to more explicitly state how context is associated with target data in RDF Knowledge Graphs, 
using default RDF 1.1 features.
Where other systems introduce custom association methods, do not support annotating all types of RDF statements, 
or introduce the risk of collisions when merging different metadata in a single triplestore,
Context Associations can be used to losslessly convert data coming from these other systems into a single model.
We show how Context Associations allows you to merge all kinds of data in a single RDF store and use a single query 
to discover which types of metadata are associated with which target data, across all original systems.

By providing a uniform representation of context statements associated with target RDF statements,
we enable discovery, exchange, storage, and processing of heterogenous contextual metadata annotations.

## References
