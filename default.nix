{ stdenvNoCC
, yarn
}:
stdenvNoCC.mkDerivation {
  name = "";
  src = ./.;
  nativeBuildInputs = [
    yarn
  ];
  installPhase = ''
    mkdir -p $out
  '';
}
