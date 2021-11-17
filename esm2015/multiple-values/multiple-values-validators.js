export class PbdsMultipleValuesValidators {
    static maxArrayLength(maxLength) {
        // use a varible to prevent compiler lambda error, see https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-387114613
        const result = (c) => {
            var _a;
            if (((_a = c.value) === null || _a === void 0 ? void 0 : _a.length) > maxLength) {
                return { pbdsMultipleValuesMaxLength: true };
            }
            return null;
        };
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwbGUtdmFsdWVzLXZhbGlkYXRvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL211bHRpcGxlLXZhbHVlcy9tdWx0aXBsZS12YWx1ZXMtdmFsaWRhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sNEJBQTRCO0lBQ3ZDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBaUI7UUFDckMsaUlBQWlJO1FBQ2pJLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBa0IsRUFBcUMsRUFBRTs7WUFDdkUsSUFBSSxDQUFBLE1BQUEsQ0FBQyxDQUFDLEtBQUssMENBQUUsTUFBTSxJQUFHLFNBQVMsRUFBRTtnQkFDL0IsT0FBTyxFQUFFLDJCQUEyQixFQUFFLElBQUksRUFBRSxDQUFDO2FBQzlDO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wsIFZhbGlkYXRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgY2xhc3MgUGJkc011bHRpcGxlVmFsdWVzVmFsaWRhdG9ycyB7XG4gIHN0YXRpYyBtYXhBcnJheUxlbmd0aChtYXhMZW5ndGg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICAvLyB1c2UgYSB2YXJpYmxlIHRvIHByZXZlbnQgY29tcGlsZXIgbGFtYmRhIGVycm9yLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL25nLXBhY2thZ3IvbmctcGFja2Fnci9pc3N1ZXMvNjk2I2lzc3VlY29tbWVudC0zODcxMTQ2MTNcbiAgICBjb25zdCByZXN1bHQgPSAoYzogQWJzdHJhY3RDb250cm9sKTogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gfCBudWxsID0+IHtcbiAgICAgIGlmIChjLnZhbHVlPy5sZW5ndGggPiBtYXhMZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHsgcGJkc011bHRpcGxlVmFsdWVzTWF4TGVuZ3RoOiB0cnVlIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=