{ stdenvNoCC
, mkYarnPackage
}:
let
  name = "coc-zk";
  tgz = mkYarnPackage {
    inherit name;
    src = ./.;
    buildPhase = ''
      yarn --offline build
      yarn --offline pack --filename main.tgz
    '';
    distPhase = "true";
    installPhase = ''
      mkdir -p $out
      cp main.tgz $out/$name.tgz
    '';
  };
in
stdenvNoCC.mkDerivation {
  inherit name;
  src = "${tgz}/${name}.tgz";
  installPhase = ''
    mkdir -p $out
    mv * $out
  '';
}
