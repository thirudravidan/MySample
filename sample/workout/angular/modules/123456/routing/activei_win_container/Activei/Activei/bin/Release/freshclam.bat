echo on
cd %2
freshclam.exe
clamd.exe --install
freshclam.exe --install
end