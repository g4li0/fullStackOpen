import Input from "./Input";

const PersonForm = ({submitAction,nameChangeHandler,numberChangeHandler}) =>
<form onSubmit={submitAction}>
        <Input text={'name:'} changeHandler={nameChangeHandler} />
        <Input text={'number:'} changeHandler={numberChangeHandler} />
        <div><button type="submit">add</button></div>
</form>;

export default PersonForm;
