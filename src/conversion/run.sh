mkdir -p 2_encoded 3_decoded

arq --query queries/nanopub-to-ca.arq --data 1_annotation-method/nanopub.trig > 2_encoded/nanopub.trig
arq --query queries/vc-to-ca.arq --data 1_annotation-method/vc.nq > 2_encoded/vc.trig

arq --query queries/ca-undo.arq --data 2_encoded/vc.trig > 3_decoded/vc.trig
arq --query queries/ca-undo.arq --data 2_encoded/nanopub.trig > 3_decoded/nanopub.trig

