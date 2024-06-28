const Find = ({text,changeHandler}) => {

    return (
        <div>
        {text} <input onChange={changeHandler} />
        </div>
    );
}

export default Find;