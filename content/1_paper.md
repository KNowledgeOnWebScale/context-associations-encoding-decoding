## Introduction {#sec-intro}

<!-- {:.comment data-author="BenDM"}
Definitions:
contextual information === more general term for metadata. Metadata is a too loaded term (and some see all RDF as "metadata"). In the scope of this paper, contextual information consists of (an arbitrary set of) RDF statements and graphs.
target data === the data some contextual information is about. In the scope of this paper, target data consists of (an arbitrary set of) RDF statements and graphs.
RDF knowledge graph === (an arbitrary set of) RDF statements and graphs, containing both target data and contextual information. Can be a merge of RDF knowledge graphs. Basically, the querying entry point
annotating === associating contextual information to target data
annotation model === used model to associate contextual information to target data. e.g. reification, graphs
annotation method === combination of model + (sometimes implicit) knowledge to associate contextual information to target data (i.e., more specific than model). e.g. VC uses combination of named graphs and default graph through predicate 'credentialSubject'. Idea of CA is that you can create a model that is a superset of existing methods.
annotation system === implementation of an annotation method. -->

Data quality _, usability, trustworthiness_{:.propose} is typically asserted through _annotation_:
associating _contextual information_ (of data quality) with _target data_.
<!-- BDM: I think usability and trustworthiness are too dense terms to use in the first sentence. I'd rather later on state something like 'data quality has many different facets, eg usability and trustworthiness as well' -->
Both the contextual information and target data can be a set of RDF statements and graphs.
<!-- This target data is an _RDF knowledge graph_, but also the combination of target data and annotations is an RDF knowledge graph. -->
There are many possible _annotation models_---the RDF model to associate contextual information to target data (e.g., reification, graphs)---and
even more _annotation methods_---the application-specific instances of an annotation model.
These annotation methods rely on application-specific specifications and protocol definitions,
as we see in mature annotation systems
such as DQV, nanopublications [^nanopublications], 
RO-Crates [^rocrates], and W3C Verifiable Credentials (VCs) [](cite:cites w3c-vc-data-model-2-20250515).

[^nanopublications]: Nanopublication Guidelines: https://nanopub.net/guidelines/working_draft/
[^rocrates]: RO-Crate Metadata Specification: https://w3id.org/ro/crate/1.2 

For example, the Data Quality Vocabulary (DQV) [](cite:cites w3c-dqv-20161215) uses the subject-bound annotation model,
where the annotation method relies on DQV-specific relations and classes.
Data quality is represented as subject-bound associations of type `dqv:QualityAnnotation` or `dqv:QualityMeasurement`
that directly associate contextual information (of data quality) to target datasets or distributions---represented through DCAT [citeneeded]---via the predicates `oa:hasTarget` (from the Web Annotation Ontology [citeneeded]) or `dqv:computedOn`, respectively.
In the Nanopublication specification, contextual information is associated through explicit graph structuring:
a nanopublication is composed of four named graphs---Head, Assertion, Provenance, and PublicationInfo---and
the Head graph uses predicates such as `np:hasAssertion`, `np:hasProvenance`, and `np:hasPublicationInfo` 
to relate the nanopublication resource to its constituent graphs [citeneeded].
In RO-Crate, contextual information is associated implicitly
through the JSON-LD graph structure of the RO-Crate Metadata Document using existing vocabularies (e.g., Schema.org[^schema]) where relationships between entities (e.g., dataset → file, file → creator) are encoded as linked properties in the `@graph` [citeneeded].
In the VC Data Model specification, contextual information is associated through an explicit credential structure: a verifiable credential is composed of core properties such as `credentialSubject` to link to the identified subject resource, and `proof` to bind the credential to a cryptographic verification method [citeneeded].

As can be seen, these annotation methods are not aligned and not always explicitly described at the data level.
When, e.g., asserting data quality,
this mismatch in annotation methods across applications
limits uniform storage, exchange, and discovery of contextual information associated to a target set of statements.
For example, when integrating both the contextual information as the target data in a triplestore,
it is hard to distinguish the contextual information from the target data
(especially when, e.g., the quality measurements themselves also have associated contextual information).

In this paper, we present Context Associations:
an approach and associated specification and tooling
to uniformly model and query
which contextual information is associated with which statements in an RDF knowledge graph.
Context Associations is available at [https://w3id.org/context-associations/specification](https://w3id.org/context-associations/specification).

To achieve a uniform queryable annotation method,
i.e., merging contextual information and their target statements from multiple applications into a single queryable triplestore,
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
- REQ2: target data can be **any arbitrary set of statements and graphs**: target data is not bound to a single specific subject or graph, and can have any existing RDF 1.1 (and upcoming RDF 1.2) statements, i.e., target data can contain any combination of triples, graphs, and triple terms.
- REQ3: annotations are **explicit**: the target statements and associated contextual information are both available in the triplestore.
- REQ4: annotations are **immutable**: there cannot be collisions or other side-effects from merging contextual information from multiple applications.
- REQ5: annotations can be **recursive**: contextual information can itself have associated contextual information. As a result, also contextual information can be any arbitrary set of statements and graphs (see REQ2).

After discussing existing annotation models and methods in [Section 2](#sec-sota),
we introduce Context Associations in [Section 3](#sec-context-associations),
demonstrate in [Section 4](#sec-demonstration) and [Section 5](#sec-sparql-evaluation),
discuss in [Section 6](#sec-comparison), and
conclude in [Section 7](#sec-conclusion).

## SoTA {#sec-sota}

<!-- BDM: I joined sota and methods. That's all related work to me, and there was _a lot_ of redundancy. -->

This section groups the existing landscape into annotation models, annotation methods,
and annotation-related extensions to RDF/SPARQL.

### Annotation models

<!-- metadata representation models - part of RDF -->
As the name suggests, the Resource Description Framework lends itself well to the description of Web resources:
RDF is inherently aimed at the annotation of information using (Web) URI references
as the abstraction layer for a target concept of the annotation.
These target URIs can be
Web resources that can be dereferenced from that target URI---following recommendations of vocabularies such as the Data Catalog Vocabulary (DCAT) [citeneeded]---
or internal entities to the RDF knowledge graph.
<!-- scope this work to 'inline' annotation -->
Within the scope of this paper and aligned with related work [](cite:cites frey2019evaluation),
we will cover annotation models that
describe assocating contextual information _within the confines of an RDF Dataset_, i.e., assume that Web dereferencing is no longer needed.

The work of Müller et al. [](cite:cites frey2019evaluation) gives an overview
of annotation models that are part of the RDF model,
namely _reification_, _singleton properties_, and _named graphs_.
They conclude that while reification offers fine-grained statement-level annotation,
it incurs significant verbosity and complexity, whereas
named graphs provide a more practical and widely supported mechanism
for grouping statements and attaching contextual information at the graph level.
Overall, they argue that no single approach is universally optimal, and
that the choice of representation depends on the required granularity of annotation and
the intended processing environment.

#### Native RDF Annotation

<!-- metadata representation models - part of RDF -->
Native RDF annotation makes  use of RDF's capability
to reference target resources using a target URI.
<!-- TODO: improve, basically I want to introduce subject-bound annotations -->
Within native RDF annotation, the boundary between contextual information and target data is fully implicit:
on data level, it is not possible to differentiate contextual information from target data (i.e., they are both similarly bound to the same subject, predicate, or object).

#### Reification
<!-- reification methods are semantically difficult to process -->
Reification was introduced with version 1.0 of the RDF specification [https://www.w3.org/TR/rdf-mt/#Reif],
with supporting vocabulary in RDF Schema [https://www.w3.org/2001/sw/RDFCore/TR/WD-rdf-schema-20030117/#ch_reificationvocab],
as a way to deconstruct triples to a set of triples defining the subject, predicate and object of the reified triple.
Sharing a subject, this set of reified triples can then be referenced in the RDF graph to associate contextual information.
However, RDF 1.0 Semantics [citeneeded] state that
that the reified statement does not entail the reification graph,
nor vice versa,
which complicates semantic interpretation and often requires additional conventions during processing.

#### Singleton Properties

Singleton properties are a proposed method in RDF to overload a triple predicate, similar to the working of Labeled Property Graphs [TODO:cite],
in which the predicate is replaced by an instanced predicate, derived from the original predicate, that can be referenced in other statements to associate contextual information to the original relation.
<!-- todo: discuss semantics of approach. -->

#### Named Graphs

Named graphs were introduced in the RDF syntax with version 1.1 of the RDF specification [todo:cite]:
a native model for defining graphs in an RDF dataset, in the form of
a (name, RDF graph) pair called a named graph.
However, similar to reification,
the semantic relation between the name identifier and RDF graph remains under-specified
and is typically fixed by application-level conventions [citeneeded].
<!-- todo: cite caroll paper -->

### Triple Terms

<!-- moved this to here for consistency -->
With the upcoming RDF 1.2 standardization work [citeneeded],
triple terms (formerly known as quoted triples in RDF-star) provide a compact way to annotate individual triples.
Triple terms can be understood as addressing the verbosity and usability limitations of reification
while preserving statement-level expressivity.

### Annotation methods

In practice, annotation methods instantiate the above models through application-specific specifications.
DQV, nanopublications,
RO-Crates, and Verifiable Credentials
each have introduced distinct annotation methods,
which were exemplified in [Section 1](#sec-intro).
<!-- todo: complement with current association models within the protocol: subject-based referencing, graph-based referencing, out-of-band referencing. -->

<!-- TODO: native RDF? -->
<!-- Data Cube Vocabulary? https://www.w3.org/TR/vocab-data-cube/ -->

<!-- Systems like trustyURI > dataset canonicalization (work of Braun? is it? or external reference) -->
Some annotation methods build on RDF knowledge graph canonicalization
to create a stable identifier to associate contextual information to.
This provides a **reificiation-like** pattern that is not limited to a single term.
Through JSON-LD expansion and with accompanying W3C CCG Note “RDF Dataset Canonicalization and Hashing” and related Data Integrity specifications, Verifiable Credentials can be interpreted as RDF datasets---with a stable identifier---for the purpose of canonicalization and cryptographic proof generation [citeneeded].
Specifications such as trustyURI make use of an RDF knowledge graph canonicalization algorithm to generate a hash, and
append this hash value as the resource extension to produce stable (and verifiable) identifiers [citeneeded].
<!-- BDM: I moved ODRL to future work. -->

Shape expressions such as SHACL [citeneeded] and SHEX [citeneeded] can be used to define a specific selection of target data.
Specifically, closed shapes in SHACL can be used, with prior work of converting shape expressions to
SPARQL queries to perform said extraction [citeneeded].
This way, the shape expression itself becomes a **proxy identifier to the target data**.

Many specifications, such as Nanopublications,
make use of these **named graphs** to organize their contents and associated context in these graphs.

<!--
Verifiable Credentials are based
on custom processing of the contents for signature generation. In the case of VCs, the "Cryptographic suite" 
used by the credential defines the necessary transformations, hashing, serialization and verification mechanisms
that need to be implemented to generate the signed credential or verify the credential signature over its contents.
[citeneeded]
-->
<!-- BDM: I don't see the relevance of this crypto stuff here. we only need to discuss annotation models and methods -->
Within Verifiable Credentials (VCs) [citeneeded],
the default graph is the target data,
and named graphs are used to store the contextual information.
This hybrid method of representing contextual information
**across default and named graphs**
allows to provide a consistent JSON structure while also being interoperable with RDF through JSON-LD.
However, this reliance on the default graph breaks the association when multiple credentials are merged into one RDF knowledge graph.

<!--
### Annotation-related extensions to RDF/SPARQL

Solutions such as tSPARQL are left out of scope as these require SPARQL extensions and are thus not interoperable.
-->
<!-- todo: Apache Jena ARQ helps the usability of SPARQL evaluations over graphs -->
<!-- BDM: I'd introduce ARQ when you need it, I have the feeling it's more an implementation detail than a sota -->

## Context Associations {#sec-context-associations}

With Context Associations, our aim is to provide a general model
to associate contextual information to target data in RDF knowledge graphs.
To define such a general annotation model,
we must support encoding and decoding of all the aforementioned methods,
including subject-, predicate-, and object-based references,
out-of-band references, single triple references,
graph references,
and their combinations.
To ensure iteroperability,
the annotation model must be expressible within the RDF 1.1 specification
and both target data and associated contextual information must be queryable through SPARQL 1.1.
In this section, we discuss both the Context Assocations model and how we can losslessly encode and decode between existing annotation methods and the Context Association model.

### Annotation Model

Within Context Associations,
associations are modeled through graph linking.
This allows supporting concrete and closed sets of statements and graphs (**REQ2**).
Graphs provide the most straightforward approach
to modeling both the sets of statements,
and their associations
through the explicit linking of these graphs (**REQ3**).
This is a standard RDF 1.1 pattern (**REQ1**).

To ensure no side-effects from merging target data and contextual information,
graph merge operations at the RDF level must be prevented.
For this, we make use of blank node identifiers for the graph name of these named graphs (**REQ4**).
This ensures the scope of the context statements and its association to a target set of statements is local
to the scope of the storage, exchange, or operation in which they are used.
If the use of blank nodes is impractical---e.g., due to limitations of
having to extract specific graphs based on their name value---skolem identifiers can be used
to ensure unique generation of the graph name at the time of its construction.

To define the exact associations between graphs,
we make use of an anchor triple that provides a directed link between both graphs in the form of
`_:sourceGraph ca:aboutGraph _:targetGraph`.
This also allows for graph chaining, i.e., recursive annotations (**REQ5**).

The specification for Context Associations can be found at [https://w3id.org/context-associations/specification](https://w3id.org/context-associations/specification).

### Model encoding/decoding

<!-- BDM: this paragraph reads wrong: you state that the original syntax can be reconstructed, but the encoding may break the syntactic constraints? Did you mean ''the original semantics' can be reconstructed? -->
Context Associations explicitly provide the directed association between contextual information and target data.
Existing annotation methods can be _encoded_ as Context Associations---typically requiring
customized processing as existing annotation methods may have implicit conventions---and
Context Associations can be _decoded_ into existing annotation methods in a general fashion.
Encoding and decoding is lossless at semantic level.
Encoding typically follows the following steps:

1. Based on the annotation method, scope the target data and identify the (different types of) contextual information
  - For NanoPub, the `AssertionGraph` is the target data and there are two types of contextual information: `Provenance` and `PublicationInfo`
  - For VCs, there are two target data graphs: the default graph, and the data linked through the `credentialSubject`. The `proof` graph contextual information to both.
2. Based on how the contextual information is attached to the target data, convert into Context Associations. The contextual information is always put in a named graph with blanknode label.
  - For reification, embed the original triple as target data in a named graph with blanknode label.
  - For a singleton property, separate the triple containing the singleton property and the accompanying `rdf:singletonPropertyOf` triple, and embed them as target data in a named graph with blanknode label.
  - For (default and named) graphs, rename the graph to a named graph with blanknode label and add the original graph name through `ca:graphName`.
  - For subject/predicate/object-bound linking, put target data in a named graph with blanknode label.

For each annotation method, customized encodings need to be provided.
These, and a general decoding of Context Associations are validated through a SPARQL CONSTRUCT Queries, are made available at https://github.com/KNowledgeOnWebScale/context-associations-encoding-decoding under the permissive MIT license.

<!-- **For a target RDF predicate term**, we cannot uniformly retain the original predicate in our encoding,
as named graphs cannot inherently be used to model annotations on triple predicates.
For the encoding, the following algorithm is used:

1. Separate the triple containing the singleton property, as well as the accompanying `rdf:singletonPropertyOf` triple, and embed them in a named graph `D`
2. Separate all annotation triples for the singleton property, and embed them in `M`
3. Add the anchor triple `M` ca:aboutGraph `D` to the named graph `M`

This results in the following context association model.

<figure id="nanopub-code" class="listing">
````/code/singleton.txt````
<figcaption markdown="block">
The resulting context association of a singleton property
</figcaption>
</figure>

**For a target RDF subject / object term**, we can structure any relevant annotations
about these terms as a graph of information,
that is about the entity identifier by the target subject/object terms.
Therefor, we can define a named graph
where it suffices to separate the inherent `data` triples from the annotations,
according to the used annotation model.
<ol>
<li> metadata description in RDF</li>
<li>two</li>
<li>three</li>
</ol>

**For a target RDF triple / set of triples**, as is the case for [entryneeded], the following algorithm is used:

**For a target RDF named graph**, as is the case for VCs, the following algorithm is used: 



In case of combined requirements, such as for VCs,
where there are a target set of triples, as well as named graphs,
the relevant algorithms are evaluated over the relevant target parts of the data. -->

The original semantics of the contextual information can be reconstructed,
however, syntactic constraints of the original annotation models
may require additional processing.
For example, VCs encode verification signatures:
this verification signature cannot be verified in the Context Association encoding
due a mismatch in the data structure (some VC signatures depend on a specific JSON frame),
and can only be verified after decoding and reframing the data in the correct JSON frame.

## Demonstration {#sec-demonstration}

To demonstrate the need for Context Associations,
we take a use-case of a research output of a researcher associated both with a university
and a company.
The contextual information consists of an RO-Crate
defining the research output, dataset, and author information,
a nanopublication of the publication,
and a verifiable credential that states the diploma of the researcher.
All demonstration data is available at https://github.com/KNowledgeOnWebScale/context-associations-encoding-decoding.

Below, we include the relevant encoded Context Associations,
for the RO-Crate, nanopublication, and verifiable credential.

<!-- ### RO-Crate
RO-Crates are a well known standard for the exchange of composite research material in scientific ecosystems.
The crate consists of a metadata document,
stored in the root directory,
that defines the structure of the RO-crate,
linking the relevant resources of the create,
through either local file references,
or URI references to external resources.

Converting this to an RDF-dataset,
the metadata document inherently can be loaded into an RDF dataset
through its JSON-LD context. -->

<!-- todo: get an idea as to how we associate metadata between external resources, e.g. `metadata.json definesInformationOver data.json`. -->



<figure id="ro-crate-code" class="listing">
````/code/ca_ro-crate_snip.txt````
<figcaption markdown="block">
Relevant RO-Crate Context Associations
</figcaption>
</figure>

<!-- 

### Nanopublication
Nanopublications inherently already make use of the named graph paradigm in structuring 
their associations of information to a target set of statements.
Encoding a nanopublication to the context association model
only requires the explicit linking of the metadata graphs to the target data graph.




piece of code to translate an example nanopub to context associations
  Nanopublication stating that  -->

<figure id="nanopub-code" class="listing">
````/code/ca_nanopub_snip.txt````
<figcaption markdown="block">
Relevant nanopublication Context Associations
</figcaption>
</figure>

<!-- 
### W3C Verifiable credentials
The W3C Verifiable Credentials (VC) data model contains its credential contents and annotations in the default graph, 
except for the credential signature information,
which is stored in the "proof graph",
which is a named graph linked to the credential using the `vc:proof` predicate,
when using the `embedded proof` approach,
that incorporates the signature information in the RDF body of the credential.
Alternative resource-based `wrapping proof` approaches are out of scope here.

Moving towards the W3C Verifiable Presentation (VP) view of a VC,
the credential contents and annotations that were stored in the default graph,
are moved towards a named graph, the "credential graph",
where now the verifiable presentation is stored in the default graph.

As a general rule of thumb,
encoding a W3C VC or VP
entails the separation of the data contents from the credential or presentation entity,
<!-- todo: is this separation necessary, if after all we are using named graphs to separate the contents
after which the relevant anchor links are added.
  -->

<figure id="vc-code" class="listing">
````/code/ca_vc_snip.txt````
<figcaption markdown="block">
Relevant VC Context Associations
</figcaption>
</figure>

<!-- 
### ODRL Policy

merge all outputs in a triplestore
one query to show 'what types of contextual information are asociated with my target data'
reverse piece/pieces of code to translate context associations to originals

We demonstrate that---for each of the aforementioned annotation systems---statements containing contextual information
can be uniformly associated with target statements and queried across applications.
Full reconstruction of the original formats from their Context Association representation
is feasible when application-specific implied modeling information is made explicit. -->

This uniform way of associating contextual information with target data allows us to extract all annotations we have about `ex:Alice`.
Extracting all annotations using standard SPARQ 1.1 requires the following sequence:

1. We extract all annotation chains. As supporting any arbitrary sequence requires property paths which is not supporting for named graphs, we first extract the anchor triples into the default graph and evaluate the chains using SPARQL property paths.
2. To regenerate the contextual information, we must create named graphs. As named graphs cannot be created in a SPARQL CONSTRUCT query, we instead extract all named graph identifiers that chain towards a target graph through (1)) its name identifier, or (2) using the `GRAPH` keyword.
3. Going over each extracted graph identifier, we can construct the output graphs.

<!-- 
Through SPARQL 1.1 evaluation, we face two problems when evaluating context assocations making use of named graphs in RDF Datasets.
The first problem is that the only way we can support the evaluation of the annotation chains through SPARQL
is by making use of the property-paths in SPARQL.
These however are not supported over named graphs,
only in the default graph or within a single named graph.
Therefor, we first need to extract the anchor triples into the default graph.

<figure id="sparql-index" class="listing">
````/code/sparql-index.txt````
<figcaption markdown="block">
Extraction of the anchor triples into the default graph.
</figcaption>
</figure>

Over this set of anchoring triples, we can now evaluate the chains using the SPARQL property paths.
<!-- This can either be done by maintaining a separate index as well, or creating it ad-hoc, since we cannot extract the full graphs yet anyways. 
And here we encounter the second problem, in the lack of native support for creating named graphs as the output of a SPARQL Construct evaluation.
The `GRAPH` keyword is only supported in the `WHERE` clause of a SPARQL query, but not in the `CONSTRUCT` clause.
Because of this,
the extraction of all graphs in an annotation chain from an RDF Dataset
requires multiple separate iterations in SPARQL 1.1.
The first step is the extraction of all named graph identifiers that chain towards a target graph.
This target named graph can be pointed to either by it's name identifier, or through a triple matching using the `GRAPH` keyword.
Since the property path operator `*` matches chains from length zero, it will also match the target named graph containing the data.

<figure id="sparql-chain" class="listing">
````/code/sparql-chain.txt````
<figcaption markdown="block">
Extraction of the metadata named graph chain.
</figcaption>
</figure>

Finally, the extraction of the individual graphs from the graph store
requires an iteration over every extracted graph identifier
in the previous step, which is then constructed as the output graph.

<figure id="sparql-extract" class="listing">
````/code/sparql-extract.txt````
<figcaption markdown="block">
Extraction of the individual graphs. Each resulting graph has to be embedded in a `<graph> { ... }` pattern.
</figcaption>
</figure>
 -->


<!-- **Solving problems with Apache Jena ARQ**

To solve the problems encountered in the extraction of the annotation chains,
especially the lack of support for constructing graphs,
which is impossible to work around in the native SPARQL evaluation, -->

However,
we can make use of the ARQ query engine provided by Apache Jena [citeneeded].
This SPARQL processor provides two functions that extend beyond the SPARQL specification,
which allow us to perform the extraction in a single iteration:
(1) ARQ provides a union graph under the identifier `urn:x-arq:UnionGraph`---a materialized union of the named graphs present in the queried RDF dataset---which allows us to extract the anchor triples from all graphs in one iteration; and
(2) ARQ supports the creation of named graphs in the `CONSTRUCT` clause of a SPARQL query, which
enables us to directly re-create the named graphs in the annotation chain,
without having to iterate separately over each graph.
Below, we show the ARQ query that allows us to uniformly gather all contextual information of `ex:Alice` .


<!-- Firstly,
where the extraction of anchor triples can be worked around by storing them in the default graph,
with ARQ can work around this problem making use of a provided union graph,
under the identifier `urn:x-arq:UnionGraph`.
This is a materialized union of the named graphs present in the queried RDF dataset,
which allows us to extract the anchor triples from all graphs in one iteration.
Secondly,
ARQ supports the creation of named graphs in the `CONSTRUCT` clause of a SPARQL query.
This enables us to directly re-create the named graphs in the annotation chain,
without having to iterate separately over each graph.
-->


<figure id="arq-code" class="listing">
````/code/jena-arq.txt````
<figcaption markdown="block">
Extraction of the named graphs annotation chains with a single construct query using Apache Jena ARQ.
</figcaption>
</figure>

<!-- 
## Comparison {#sec-comparison}

TODO include table that gives overview of (✅, ❓, or ❌)

- reification
- singleton property
- combination default graph and named graphs (also VC)
- named graphs (also nanopub)
- application model (subject-based, also dqv, web annotation)
- Context Associations

for requirements

- interoperable 
- annotation level
- 

- interoperable (✅, ❓= needs protocol-specific queries, ❌ = RDF/SPARQL needs extensions)
- RDF support (✅, ❓= only one triple/only triples associated to one subject/only triples/only triples and quads/...)
- explicit (✅, or ❌)
- immutable (✅, or ❌)
- recursive (✅, or ❌)

tSPARQL and RO-Crate are taken out of scope
as tSPARQL needs custom extensions
and RO-Crate's association model is outside the scope of the RDF data. -->

<!-- me thinks it's gonna look something like this -->

<figure id="table-comparison" class="table" markdown="block">

|               | Reification              | Singleton property       | Default graph and named graph  | Named graphs   | Subject-bound | Context Associations |
|---------------|--------------------------|--------------------------|------------------------------------------|-------------------------------|--------------------------------------------------|----------------------|
| Interoperable | ✅                       | ✅                       | ❓                                       | ❓                            | ❓                                                    | ✅                    |
| RDF Support   | one triple      | one triple      | triples/<br/>triple terms            | triples/<br/>triple terms | subject-bound triples                          | ✅                    |
| Explicit      | ✅                       | ✅                       | ✅                                       | ✅                            | ❓                                                    | ✅                    |
| Immutable     | ❓ | ❓ | default graph collisions             | ❓      | ❓                              | ✅                    |
| Recursive     | ✅                       | ✅                       | ❌: default graph                        | ✅                            | ✅                                                    | ✅                    |

<figcaption markdown="block">

Comparison of the requirements of existing annotation models and methods with Context Associations.
At _Interoperable_, ❓ denotes that custom annotation methods are introduced to interpret the annotation model.
At Immutable, ❓ denotes immutability requires globally unique and non-colliding identifiers.

</figcaption>
</figure>

## Conclusion {#sec-conclusion}

Context Associations is an approach and associated specification and tooling
that allows to more explicitly state how context is associated with target data in RDF knowledge graphs, 
using default RDF 1.1 features.
Where other systems introduce custom association methods,
do not support annotating all types of RDF statements, 
or introduce the risk of collisions when merging different annotations in a single triplestore,
Context Associations can be used to losslessly convert data coming from these other systems into a single queryable annotation model.
We show how Context Associations allows you to merge all kinds of data in a single RDF store
and use a single query
to discover which types of contextual information are associated with which target data, across all original systems.

By providing a uniform representation of context statements associated with target RDF statements,
we enable discovery, exchange, storage, and processing of heterogenous annotations.

<!-- TODO: improve -->
The Open Digital Rights Language (ODRL) specification defines the resource to which the policy is associated
either through a `odrl:hasPolicy` predicate, defined over the resource, or
inversely the resource can be linked from the policy using the `odrl:target` property.
This policy target is defined in the specification as a resource or a collection of resources that are the subject of a Rule.
Context Associations can be used as general model to cover this association,
which we will further investigate in future work.

<!-- TODO: mention about just making explicit what is in protocols, not making any judgements on 'what is metadata' -->
