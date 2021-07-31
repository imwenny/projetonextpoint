import React, { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Search, Delete, Close, Add } from "@material-ui/icons";
import { alpha, makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  List,
  Button,
  Dialog,
  InputBase,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Avatar,
  Checkbox,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  ListItem
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  loader: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(6.7),
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function App() {
  const [_firstName, setFirstName] = React.useState("");
  const [_lastName, setLastName] = React.useState("");
  const [_users, setUsers] = React.useState([]);
  const [_query, setQuery] = React.useState("");
  const [_image, setImage] = React.useState("");
  const [_currentSelectedItemId, setCurrentSelectedItemId] = React.useState("");
  const [_isLoading, setIsLoading] = React.useState(false)
  const [_idList, setIdList] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [sizes, setSizes] = React.useState({});
  const [openEditor, setOpenEditor] = React.useState(false);


  const classes = useStyles();
  const updateDimensions = () => {
    var w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName('body')[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
      height = w.innerHeight || documentElement.clientHeight || body.clientHeight;
    setSizes({ 'width': width, 'height': height, 'offsetX': width / 12 })
  }

  const fetchData = () => {
    axios.get("http://localhost:3001/query/" + _query).then((res) => {
      setUsers(res.data);
    });
  }

  useEffect(() => {
    fetchData()
  }, [_query]);

  useEffect(() => {

    window.addEventListener("resize", updateDimensions)
    updateDimensions()
    return () => {
      window.removeEventListener("resize", updateDimensions);
    }

  }, []);

  return (
    <div>
      <div>
        <div>
          <Dialog open={openEditor}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => {
                    setOpenEditor(false);
                  }}
                  aria-label="close"
                >
                  <Close />
                </IconButton>

                <Typography variant="h6" className={classes.title}>
                  Editar registro
                </Typography>
              </Toolbar>
            </AppBar>

            <div style={{ margin: "auto" }}>
              <List>
                <ListItem style={{ justifyContent: "center" }} button>
                  <TextField
                    value={_firstName}
                    id="standard-basic"
                    label="Primeiro nome"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />

                  <TextField
                    id="standard-basic"
                    value={_lastName}
                    label="Último nome"
                    style={{ marginLeft: "2%" }}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem style={{ justifyContent: "center", marginTop: "2%" }}>
                  <input
                    id="photo"
                    type="file"
                    style={{ marginTop: "1%" }}
                    onChange={(e) => {
                      let reader = new FileReader();
                      reader.onload = (e) => {
                        setImage(e.target.result);
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }}
                  />
                </ListItem>
                <Divider style={{ marginTop: "2%" }} />
                <ListItem style={{ marginTop: "2%" }}>
                  {_image !== undefined && _image.length > 0 && (
                    <img style={{ objectFit: "cover", width: "20%", margin: "auto", marginTop: "3%" }} src={_image} />
                  )}
                </ListItem>
              </List>
              <Button
                style={{
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  transform: "translateX(50%)",
                  width: "50%",
                  marginTop: "5%",
                  marginBottom: "5%"
                }}
                autoFocus
                color="inherit"
                onClick={() => {
                  console.log(_image)
                  if (_firstName.length > 0 && _lastName.length > 0 && _image.length > 0 && _image.indexOf("image") != -1) {
                    axios
                      .post("http://localhost:3001/update", {
                        id: _currentSelectedItemId,
                        firstName: _firstName,
                        lastName: _lastName,
                        img: _image,
                      })
                      .then((res) => {
                        if (res.data[0].affectedRows > 0) {
                          Swal.fire({
                            title: "Sucesso!",
                            text: "Registro alterado com sucesso!",
                            icon: "success",
                            confirmButtonText: "OK!",
                          }).then(() => {
                            fetchData()
                          })
                        } else {
                          Swal.fire({
                            title: "Erro!",
                            text: "Falha ao tentar atualizar registro.",
                            icon: "error",
                            confirmButtonText: "OK!",
                          });
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    setImage("");
                    setLastName("");
                    setFirstName("");
                    setOpenEditor(false);
                  }
                  else {
                    setOpen(false)
                    Swal.fire({
                      title: "Erro!",
                      text: "Falha ao tentar atualizar registro, verifique os campos e tente novamente. Formatos de imagem aceitos: (GIF, PNG, JPEG, JPG)",
                      icon: "error",
                      confirmButtonText: "OK!",
                    })
                  }
                }}
              >
                Salvar
              </Button>
            </div>
          </Dialog>
        </div>
        <Dialog open={open}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  setOpen(false);
                }}
                aria-label="close"
              >
                <Close />
              </IconButton>

              <Typography variant="h6" className={classes.title}>
                Criar novo registro
              </Typography>
            </Toolbar>
          </AppBar>

          <div style={{ margin: "auto" }}>
            <List>
              <ListItem style={{ justifyContent: "center" }} button>
                <TextField
                  id="standard-basic"
                  label="Primeiro nome"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />

                <TextField
                  id="standard-basic"
                  label="Último nome"
                  style={{ marginLeft: "2%" }}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
              </ListItem>
              <Divider />
              <ListItem style={{ justifyContent: "center", marginTop: "2%" }}>
                <input
                  id="photo"
                  type="file"
                  style={{ marginTop: "1%" }}
                  onChange={(e) => {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                      setImage(e.target.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }}
                />
              </ListItem>
              <Divider style={{ marginTop: "2%" }} />
              <ListItem style={{ marginTop: "2%" }}>
                {_image !== undefined && _image.length > 0 && (
                  <img style={{ objectFit: "cover", width: "20%", margin: "auto", marginTop: "3%" }} src={_image} />
                )}
              </ListItem>
            </List>
            <Button
              style={{
                backgroundColor: "#3f51b5",
                color: "#fff",
                transform: "translateX(50%)",
                width: "50%",
                marginTop: "5%",
                marginBottom: "5%"
              }}
              autoFocus
              color="inherit"
              onClick={() => {
                console.log(_image)
                if (_firstName.length > 0 && _lastName.length > 0 && _image.length > 0 && _image.indexOf("image") != -1) {
                  axios
                    .post("http://localhost:3001/insert", {
                      firstName: _firstName,
                      lastName: _lastName,
                      img: _image,
                    })
                    .then((res) => {
                      if (res.data[0].affectedRows > 0) {
                        Swal.fire({
                          title: "Sucesso!",
                          text: "Você se cadastrou com sucesso.",
                          icon: "success",
                          confirmButtonText: "OK!",
                        }).then(() => {
                          fetchData()
                        })
                      } else {
                        Swal.fire({
                          title: "Erro!",
                          text: "Falha ao se registrar.",
                          icon: "error",
                          confirmButtonText: "OK!",
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  setImage("");
                  setLastName("");
                  setFirstName("");
                  setOpen(false);
                }
                else {
                  setOpen(false)
                  Swal.fire({
                    title: "Erro!",
                    text: "Falha ao se registrar, verifique os campos e tente novamente. Formatos de imagem aceitos: (GIF, PNG, JPEG, JPG)",
                    icon: "error",
                    confirmButtonText: "OK!",
                  })
                }
              }}
            >
              Salvar
            </Button>
          </div>
        </Dialog>
      </div>

      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              onClick={() => {
                setOpen(true);
              }}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <Add />
            </IconButton>

            <Typography className={classes.title} variant="h6" noWrap>
              CRUD
            </Typography>
            {_idList.length > 0 && (
              <IconButton
                onClick={() => {
                  setIsLoading(true)
                  _idList.map((id) => {
                    axios.post("http://localhost:3001/delete", {
                      id: id
                    })
                      .then((res) => {
                        if (res.data[0].affectedRows > 0) {
                          setIsLoading(false)
                          fetchData()
                        }
                        else {
                          Swal.fire({
                            title: "Erro!",
                            text: "Falha ao deletar.",
                            icon: "error",
                            confirmButtonText: "OK!",
                          });
                        }
                      })
                      .catch((err) => {
                        Swal.fire({
                          title: "Erro!",
                          text: "Falha ao deletar.",
                          icon: "error",
                          confirmButtonText: "OK!",
                        });
                      })
                  })
                  setIdList([])
                }}
                edge="end"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
              >
                <Delete />
              </IconButton>
            )}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <Search />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>
      {
        _isLoading &&
        <div className={classes.loader}>
          <LinearProgress />
          <LinearProgress color="secondary" />
        </div>
      }
      <List style={{ marginTop: sizes.width > 768 && !_isLoading ? "5%" : (!_isLoading ? "12%" : "0%") }} >
        {
          _users.length > 0
          &&
          <>
            {
              _users.map((user) => (
                <ListItem key={user.id} button onClick={(e) => {
                  setCurrentSelectedItemId(user.id)
                  axios.get("http://localhost:3001/query/" + user.id)
                    .then((res) => {
                      setImage(res.data[0].img)
                      setFirstName(res.data[0].nome.split(' ')[0])
                      setLastName(res.data[0].nome.split(' ')[1])
                      setOpenEditor(true)
                    })
                }}>
                  <ListItemAvatar>
                    <Avatar alt={user.nome} src={user.img} />
                  </ListItemAvatar>
                  <ListItemText primary={user.nome} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      id={user.id.toString()}
                      color="primary"
                      edge="end"
                      onChange={(e) => {
                        if (_idList.includes(e.target.id)) {
                          setIdList(_idList.filter(id => id != e.target.id))
                        }
                        else {
                          setIdList([..._idList, e.target.id])
                        }
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            }
          </>
        }
        {
          _users.length == 0
          &&
          <ListItem key={"1"} button>
            <ListItemText primary={"Nenhum registro foi encontrado )="} />
          </ListItem>
        }
      </List>
    </div >
  );
}

export default App;