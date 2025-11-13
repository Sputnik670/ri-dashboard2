{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.python311Packages.uvicorn
    pkgs.python311Packages.fastapi
    pkgs.nodePackages.npm
  ];
}