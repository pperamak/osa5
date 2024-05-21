const Notification = ({ message, redMsg }) => {
  const errorStyle={
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const redErrorStyle={
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }


  if (redMsg === null && message !==null){
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
  }else if(redMsg !== null && message ===null){
    return (
      <div style={redErrorStyle}>
        {redMsg}
      </div>
    )
  }else if (redMsg===null && message===null){
    return null
  }
}


export default Notification