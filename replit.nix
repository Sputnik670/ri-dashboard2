{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.bash
    pkgs.curl
  ];
}