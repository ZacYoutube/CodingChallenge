export default function InputField({ displayName, type, value, onChange, placeholder, index }) {
    return (
        <label>
            {displayName}
            <input type={type} value={value} placeholder={placeholder} onChange={(e) => { onChange(e, index) }} />
        </label>
    );
}