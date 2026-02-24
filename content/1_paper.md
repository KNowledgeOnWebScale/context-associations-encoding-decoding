## Introduction

Data quality _, usability, trustworthiness_{:.propose} is asserted through contextual metadata annotations.
For example, in the World Wide Web Consortium's Data Quality Vocabulary (DQV) [citeneeded],
quality is represented as subject-bound annotations of type `dqv:QualityAnnotation` or `dqv:QualityMeasurement`
that directly link contextual (data quality) metadata to target datasets or distributions via the prediate.
Within this scope, the dataset is described as a DCAT dataset,
so when integrating both the contextual metadata as the target data in a triplestore,
it is hard to distinguish metadata from the target data
(especially when, e.g., the quality measurements themselves also haven contextual metadata annotations).

We see that the association between contextual information and target data
often depends on application-specific specifications and protocol definitions,
as we see in mature annotation systems such as DQV [](cite:cites w3c-dqv-20161215), nanopublications [^nanopublications], 
RO-Crates [^rocrates], and W3C Verifiable Credentials (VCs) [](cite:cites w3c-vc-data-model-2-20250515).

[^nanopublications]: Nanopublication Guidelines: https://nanopub.net/guidelines/working_draft/
[^rocrates]: RO-Crate Metadata Specification: https://w3id.org/ro/crate/1.2 

In DQV, contextual information is associated through specific triples typed 
as class `dqv:QualityAnnotation` or `dqv:QualityMeasurement` with the relations 
`oa:hasTarget` (reusing the Web Annotation association model) or 
`dqv:computedOn` to the target dataset or distribution, respectively [citeneeded].
In the Nanopublication specification, contextual information is associated
through explicit graph structuring: nanopublication is composed of four named 
graphs---Head, Assertion, Provenance, and PublicationInfo---and
the Head graph uses predicates such as `np:hasAssertion`, `np:hasProvenance`, and `np:hasPublicationInfo` 
to relate the nanopublication resource to its constituent graphs [citeneeded].
In RO-Crate, contextual information is associated implicitly
through the JSON-LD graph structure of the RO-Crate Metadata Document using existing vocabularies (e.g., Schema.org) where relationships between entities (e.g., dataset → file, file → creator) are encoded as linked properties in the `@graph` [citeneeded].
In the VC Data Model specification, contextual information is associated through an explicit credential structure: a verifiable credential is composed of core properties such as `credentialSubject` to link to the identified subject resource, and `proof` to bind the credential to a cryptographic verification method [citeneeded].
Through JSON-LD expansion and with accompanying W3C CCG Note “RDF Dataset Canonicalization and Hashing” and related Data Integrity specifications, Verifiable Credentials can be interpreted as RDF datasets for the purpose of canonicalization and cryptographic proof generation [citeneeded].
_Finally, the Open Digital Rights Language (ODRL) specification defines the resource to which the policy is associated either through a `odrl:hasPolicy` predicate, defined over the resource, or inversely the resource can be linked from the policy using the `odrl:target` property. This policy target is defined in the specification as a resource or a collection of resources that are the subject of a Rule._{:.propose}
<!-- Data Cube Vocabulary? https://www.w3.org/TR/vocab-data-cube/ -->

As can be seen, these association methods are not aligned and not always explicit at the data level.
When, e.g., asserting data quality, this mismatch in association methods across applications
limits uniform storage, exchange, and discovery of metadata linked to a target set of statements.

In this paper, we present Context Associations:
an approach and associated specification and tooling
to uniformly model and query
which metadata is associated with which sets of statements in an RDF dataset.
Context Associations is available at [https://w3id.org/context-associations/specification](https://w3id.org/context-associations/specification).

To achieve a uniform queryable metadata association method,
i.e., merging contextual metadata annotations and their target data from multiple applications into a single queryable triplestore,
we put forward the following target requirements:

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
- REQ4: contextual metadata annotations are **immutable**: there cannot be collisions or other side-effects from merging annotations from multiple applications.
- REQ5: contextual metadata annotations can be **recursive**: annotations themselves can be annotated. As a result, also contextual metadata annotations can be any arbitrary set of statements (see REQ2).

## SoTA

_Over the years, many data-modeling approaches are introduced for annotating contextual metadata,
mostly using RDF reification, named graphs, and triple terms.
Solutions such as tSPARQL are left out of scope as these require SPARQL extensions and are thus not interoperable._{:.remove}
<!-- todo: Maybe we mention this, as well as Apache Jena ARQ, but only lightly --- these extensions help the usability of SPARQL evaluations over graphs -->

<!-- todo: URI based annotation -->
As the name suggests, the Resource Description Framework lends itself well to the description of Web resources. 
Most of the RDF data models that annotate resources, make use of the capability of RDF to reference resources
using their identifier, most often in the form of a Web URI, to define information about this referenced resource.
Vocabularies such as the Data Catalog Vocabulary (DCAT) [citeneeded], define the recommendation that these 
references should provide access to these resources using Web-friendly methods for data retrieval.
<!-- todo: URI based annotation -->

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


<!-- todo: metadata representation models - part of RDF -->

<!-- todo: reification methods are semantically difficult to process -->
These metadata representation models, as defined in the work of Müller et al. [](cite:cites frey2019evaluation)
define an internal strategy to annotating information defined within the confines of an RDF Dataset.
Where their definition has been included since the standardization work done for RDF 1.0 [citeneeded],
and their vocabulary was included in the accompanying RDF-Schema specification [citeneeded], 
their semantic definition in the specification defining the RDF 1.0 Semantics defines that 
neither the statement implies its reification graph, nor the inverse.
This leads to difficulties for the semantic interpretation of referenced content, 
both in a requirement for syntactic conversion, and semantic interpretation.

The inclusion of named graphs in RDF 1.1 tried to resolve some of these issues, 
including a native model for defining graphs in an RDF dataset, in the form of
a (name, RDF graph) pair called a named graph. However, similar to reification, 
the semantic interpretation of the RDF graph, and its link to the name identifier
was left undefined, making it's use restricted to specification documents defining
their use at a mostly syntactical level. [citeneeded] 
<!-- todo: cite caroll paper -->

<!-- moved this to here for consistency -->
Since then and with the upcoming standardization work of RDF 1.2,
triple terms (formerly known as RDF-Star) were introduced to provide annotations to individual triples.
Triple terms can be understood as addressing the verbosity and usability limitations of reification
while retaining its expressivity at the individual statement level.

<!-- todo: Adopted models such as VC, have custom routines for hash calculation -->
In addition to the native RDF annotation models, specifications such as Verifiable Credentials are based
on custom processing of the contents for signature generation. In the case of VCs, the "Cryptographic suite" 
used by the credential defines the necessary transformations, hashing, serialization and verification mechanisms
that need to be implemented to generate the signed credential or verify the credential signature over its contents.
[citeneeded]


<!-- todo: Systems like trustyURI > dataset canonicalization (work of Braun? is it? or external reference) -->
In addition to some VC suites that support signatures through RDF dataset canonicalization [citeneeded],
specifications such as trusty URIs make use of RDF Dataset canonicalization algorithm to generate a hash over
content served on the Web, and append this hash value as the resource extension. Any processing client that
understands this concept will then be able to verify if the contents of the referenced resource has changed
since the creation of the trusty URI. Mechanisms like memento can then be added to refer to previous resource
versions to find an exact match. [citeneeded]

<!-- todo: complement with current association models within the protocol: subject-based referencing, graph-based referencing, out-of-band referencing. -->
To define a specification that can model the association of context in a generic manner, we must be able to 
support both the encoding and decoding of the above defined approaches into a single representative data model.
This requires subject-, predicate- and object-based references, out-of-band references, single triple references
and graph references.

## Method

In this work, we will evaluate the metadata annotation methods available in RDF.

<!-- todo: discuss semantics of approaches. -->

### URI references
The RDF data modeling approach is inherently aimed at the annotation of information using URI references
as the abstraction layer for a target concept of the annotation. This can take the form of Web resources, 
that can be dereferenced from that target URI, or of internal entities to the RDF knowledge graph.

### Reification
The concept of reification was introduced with version 1.0 of the RDF specification [https://www.w3.org/TR/rdf-mt/#Reif] and RDF Schema vocabulary [https://www.w3.org/2001/sw/RDFCore/TR/WD-rdf-schema-20030117/#ch_reificationvocab], as a way to deconstruct triples to a set of triples defining the subject, predicate and object of the reified triple. Sharing a subject, this set of reified triples can then be referenced by metadata in the RDF graph.

### Singleton property
Singleton properties are a proposed method in RDF to overload a triple predicate, similar to the working of Labeled Property Graphs [TODO:cite], 
in which the predicate is replaced by an instanced predicate, derived from the original predicate, that can be referenced in other statements to associate contextual information to the original relation.

### Named graphs
Named graphs were introduced in the RDF syntax with version 1.1 of the RDF specification [todo:cite].
Many specifications, such as Nanopublications, 
make use of these named graphs to organize their contents and associated context in these graphs.

### Hybrid use of named graph and default graph
Specifications such as W3C Verifiable Credentials [citeneeded], generate metadata associations 
that annotate the contents of the default graph, making use of named graphs to store the metadata definitions.
This allows them to provide a consistent JSON structure, while also being interoperable with RDF through JSON-LD.
However, this reliance on the default graph breaks the  is lost when merging the credential into RDF Knowledge Graphs.

### Shapes
Shape expressions such as SHACL [citeneeded] and SHEX [citeneeded] can be used to define a specific selection of data 
in an RDF dataset. Specifically, closed shapes in SHACL can be used, with prior work of converting shape expressions to
SPARQL queries to perform said extraction [citeneeded].

## Context Associations
With Context Associations, our aim is to provide a general approach for modeling associations
of context to target data in RDF knowledge graphs. The approach must be able to model the different 
expressions of the aforementioned metadata annotation mechanisms supported by RDF into a single representative data model,
that both be expressed within the RDF 1.1 specification, and be queried for data and associated metadata through SPARQL 1.1.

The specification for Context Associations can be found at [https://w3id.org/context-associations/specification](https://w3id.org/context-associations/specification).

### Data Model
To model generic associations between sets of statements in RDF Datasets, named graphs provide the most straightforward approach
to modeling both the sets of statements, and the associations between said statement sets through the linking of these named graphs.
To define the exact associations between graphs, we make use of an anchor triple that links both graphs in the form of
`_:sourceGraph ca:aboutGraph _:targetGraph`.



### Model conversion
When we state that we are converting metadata annotation models into the context association model, 
we define this at a syntactic level, where both a conversion and de-conversion can take place
to identically reconstruct the original metadata syntax of the metadata descriptions for an exact piece of data targeted in the RDF dataset.
However, this conversion may break the syntactic constraints of the original annotation models, such as for VCs, where the resulting
context association model of the signature cannot be verified because of a mismatch in the data structure. Here, the metadata model should
first be reverted before evaluating operations with syntactic constraints.

The conversion algorithm takes the following form: 

**For a target RDF predicate term**, we cannot uniformly retain the original predicate in our conversion, 
as named graphs cannot inherently be used to model annotations on triple predicates. 
For the conversion, the following algorithm is used:

<ol>
<li>Separate the triple containing the singleton property, as well as the accompanying `rdf:singletonPropertyOf` triple, and embed them in a named graph `D`</li>
<li>Separate all annotation triples for the singleton property, and embed them in `M`</li>
<li>Add the anchor triple `M` ca:aboutGraph `D` to the named graph `M`</li>
</ol>

This results in the following context association model.

<figure id="nanopub-code" class="listing">
````/code/singleton.txt````
<figcaption markdown="block">
The resulting context association of a singleton property
</figcaption>
</figure>

**For a target RDF subject / object term**, we can structure any relevant metadata about these terms as a graph of information, 
that is about the entity identifier by the target subject/object terms. 
Therefor, we can define a named graph 
we it suffices to separate the inherent `data` triples from the metadata annotation, 
according to the used annotation model.
<ol>
<li> metadata description in RDF</li>
<li>two</li>
<li>three</li>
</ol>

**For a target RDF triple / set of triples**, as is the case for [entryneeded], the following algorithm is used:

**For a target RDF named graph**, as is the case for VCs, the following algorithm is used: 



In case of combined requirements, such as for VCs, where there are a target set of triples, as well as named graphs, 
the relevant algorithms are evaluated over the relevant target parts of the data.


## Demonstration


### RO-Crate
RO-Crates are a well known standard for the exchange of composite research material in scientific ecosystems.
The crate consists of a metadata document, stored in the root directory, that defines the structure of the RO-crate,
linking the relevant resources of the create, through either local file references, or URI references to external resources.

Converting this to an RDF-dataset, the metadata document inherently can be loaded into an RDF dataset, through its JSON-LD context.

<!-- todo: get an idea as to how we associate metadata between external resources, e.g. `metadata.json definesInformationOver data.json`. -->



<figure id="ro-crate-code" class="listing">
````/code/ca_ro-crate.txt````
<figcaption markdown="block">
Extraction of the individual graphs
</figcaption>
</figure>



### Nanopublication
Nanopublications inherently already make use of the named graph paradigm in structuring 
their associations of information to a target set of statements.
The conversion of a nanopublication to the context association model, 
only requires the explicit linking of the metadata graphs to the target data graph.




piece of code to translate an example nanopub to context associations
  Nanopublication stating that 

<figure id="nanopub-code" class="listing">
````/code/ca_nanopub.txt````
<figcaption markdown="block">
Converting a nanopublication to the context association model.
</figcaption>
</figure>


### W3C Verifiable credentials
The W3C Verifiable Credentials (VC) data model contains its credential contents and metadata in the default graph, 
except for the credential signature information, which is stored in the "proof graph", which is a named graph linked to the
credential using the `vc:proof` predicate, when using the `embedded proof` approach, that incorporates the signature information 
in the RDF body of the credential. Alternative resource-based `wrapping proof` approaches are out of scope here.

Moving towards the W3C Verifiable Presentation (VP) view of a VC, the credential contents and metadata that were stored in the
default graph, are moved towards a named graph, the "credential graph", where now the verifiable presentation is stored in the default graph.

<!-- todo: cleanup! -->

As a general rule of thumb, the conversion of a W3C VC or VP, entails the separation of the data contents from the credential or presentation entity, 
<!-- todo: is this separation necessary, if after all we are using named graphs to separate the contents -->
after which the relevant anchor links are added.
 

<figure id="vc-code" class="listing">
````/code/ca_vc.txt````
<figcaption markdown="block">
Converting a W3C Verifiable Credential or Verifiable Presentation to the context association model.
</figcaption>
</figure>


### ODRL Policy


merge all outputs in a triplestore
one query to show 'what types of metadata are asociated with my target data'
reverse piece/pieces of code to translate context associations to originals

We demonstrate that---for each of the aforementioned annotation systems---metadata statements can be uniformly associated with target statements and queried across applications.
Full reconstruction of the original formats from their Context Association representation
is feasible when application-specific implied modeling information is made explicit.

## SPARQL evaluation

Through SPARQL 1.1 evaluation, we face two problems when evaluating context assocations making use of named graphs in RDF Datasets.
The first problem is that the only way we can support the evaluation of the metadata chains through SPARQL is by making use of the property-paths in SPARQL. These however are not supported over named graphs, only in the default graph or within a single named graph.
Therefor, we first need to extract the anchor triples into the default graph.

<figure id="sparql-index" class="listing">
````/code/sparql-index.txt````
<figcaption markdown="block">
Extraction of the anchor triples into the default graph.
</figcaption>
</figure>

Over this set of anchoring triples, we can now evaluate the chains using the SPARQL property paths.
<!-- This can either be done by maintaining a separate index as well, or creating it ad-hoc, since we cannot extract the full graphs yet anyways. -->
And here we encounter the second problem, in the lack of native support for creating named graphs as the output of a SPARQL Construct evaluation.
The `GRAPH` keyword is only supported in the `WHERE` clause of a SPARQL query, but not in the `CONSTRUCT` clause.
Because of this, the extraction of all graphs in a metadata chain from an RDF Dataset requires multiple separate iterations in SPARQL 1.1. 
The first step is the extraction of all named graph identifiers that chain towards a target graph.
This target named graph can be pointed to either by it's name identifier, or through a triple matching using the `GRAPH` keyword.
Since the property path operator `*` matches chains from length zero, it will also match the target named graph containing the data.

<figure id="sparql-chain" class="listing">
````/code/sparql-chain.txt````
<figcaption markdown="block">
Extraction of the metadata named graph chain.
</figcaption>
</figure>

Finally, the extraction of the individual graphs from the graph store, requires an iteration over every extracted graph identifier
in the previous step, which is then constructed as the output graph.

<figure id="sparql-extract" class="listing">
````/code/sparql-extract.txt````
<figcaption markdown="block">
Extraction of the individual graphs. Each resulting graph has to be embedded in a `<graph> { ... }` pattern.
</figcaption>
</figure>



**Solving problems with Apache Jena ARQ**

To solve the problems encountered in the extraction of the metadata chains, especially the lack of support for constructing graphs, which is impossible to work around in the native SPARQL evaluation, we can make use of the ARQ query engine provided by Apache Jena [citeneeded].
This SPARQL processor provides two functions that extend beyond the SPARQL specification, which allow us to perform the extraction in a single iteration.

Firstly, where the extraction of anchor triples can be worked around by storing them in the default graph, 
with ARQ can work around this problem making use of a provided union graph, under the identifier `urn:x-arq:UnionGraph`. 
This is a materialized union of the named graphs present in the queried RDF dataset, which allows us to extract the anchor triples from all graphs in one iteration. Secondly, ARQ supports the creation of named graphs in the `CONSTRUCT` clause of a SPARQL query. 
This enables us to directly re-create the named graphs in the metadata chain, without having to iterate separately over each graph.


<figure id="arq-code" class="listing">
````/code/jena-arq.txt````
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
Context Associations can be used to losslessly convert data coming from these other systems into a single queryable annotation model.
We show how Context Associations allows you to merge all kinds of data in a single RDF store and use a single query 
to discover which types of metadata are associated with which target data, across all original systems.

By providing a uniform representation of context statements associated with target RDF statements,
we enable discovery, exchange, storage, and processing of heterogenous contextual metadata annotations.


