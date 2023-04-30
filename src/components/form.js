import InputField from "./inputField";

export default function InputForm({ data }) {
  return (
    <>
      {data.map((elem, index) => (
        <InputField
          key={index}
          displayName={elem.displayName}
          type={elem.type}
          placeholder={elem.placeholder}
          value={elem.value}
          onChange={elem.onChange}
          index={index}
        />
      ))}
    </>
  );
}