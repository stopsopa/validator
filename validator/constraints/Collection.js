

const Collection = opt => {

    opt = Object.assign({
        fields                  : [],
        allowExtraFields        : false,
        allowMissingFields      : false,
        extraFieldsMessage      : 'This field was not expected.',
        missingFieldsMessage    : 'This field is missing.',
    }, opt);


    // no known options set? $options is the fields array
    // if (\is_array($options)
    // && !array_intersect(array_keys($options), array('groups', 'fields', 'allowExtraFields', 'allowMissingFields', 'extraFieldsMessage', 'missingFieldsMessage'))) {
    //     $options = array('fields' => $options);
    // }

}

Collection.MISSING_FIELD_ERROR = '2fa2158c-2a7f-484b-98aa-975522539ff8';
Collection.NO_SUCH_FIELD_ERROR = '7703c766-b5d5-4cef-ace7-ae0dd82304e9';
Collection.errorNames = {
    MISSING_FIELD_ERROR: 'MISSING_FIELD_ERROR',
    NO_SUCH_FIELD_ERROR: 'NO_SUCH_FIELD_ERROR',
};

module.exports = Collection;