arq --query queries/nanopub-to-ca.arq --data src/nanopub.trig > tmp/nanopub.trig
arq --query queries/vc-to-ca.arq --data src/vc.nq > tmp/vc.trig

arq --query queries/ca-undo.arq --data tmp/vc.trig > out/vc.trig
arq --query queries/ca-undo.arq --data tmp/nanopub.trig > out/nanopub.trig

