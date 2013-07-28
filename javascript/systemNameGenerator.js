var constNames = ["Andromedae","Antliae","Apodis","Aquarii","Aquilae","Arae","Arietis","Aurigae","Bootis"
,"Caeli","Camelopardalis","Cancri","Canun Venaticorum","Canis Majoris","Canis Minoris","Capricorni","Carinae"
,"Cassiopeiae","Centauri","Cephei","Ceti","Chamaleontis","Circini","Columbae","Comae Berenices","Coronae Australis"
,"Coronae Borealis","Corvi","Crateris","Crucis","Cygni","Delphini","Doradus","Draconis","Equulei","Eridani"
,"Fornacis","Geminorum","Gruis","Herculis","Horologii","Hydrae","Hydri","Indi","Lacertae","Leonis","Leonis Minoris"
,"Leporis","Librae","Lupi","Lyncis","Lyrae","Mensae","Microscopii","Monocerotis","Muscae","Normae","Octantis"
,"Ophiuchi","Orionis","Pavonis","Pegasi","Persei","Phoenicis","Pictoris","Piscium","Pisces Austrini","Puppis"
,"Pyxidis","Reticuli","Sagittae","Sagittarii","Scorpii","Sculptoris","Scuti","Serpentis","Sextantis","Tauri"
,"Telescopii","Trianguli","Trianguli Australis","Tucanae","Ursae Majoris","Ursae Minoris","Velorum","Virginis"
,"Volantis","Vulpeculae"];

var greekLetters = ["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu"
,"Nu","Xi","Omicron","Pi","Rho","Sigma","Tau","Upsilon","Phi","Chi","Psi","Omega"];

var systemName = greekLetters[Math.floor(Math.random()*(greekLetters.length-1))]+" "
			+constNames[Math.floor(Math.random()*(constNames.length-1))];
			
