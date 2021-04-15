
const RequireAuth = (Component: any) => {
  return (props: any) => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/'
    }
    return <Component {...props} />
  }
}

export default RequireAuth;
